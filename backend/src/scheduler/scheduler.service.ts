import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ScheduleDto } from './dto/schedule.dto';


@Injectable()
export class SchedulerService {
  constructor(private readonly tasksService: TasksService) {}

  private readonly PRIORITY_WEIGHTS: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  async scheduleTasks(
    token: string,
    userId: string,
    scheduleDto?: ScheduleDto,
  ) {
    const preferences = await this.tasksService.getPreferences(token, userId);

    if (!preferences) {
      throw new InternalServerErrorException(
        'User preferences not found. Please configure your available hours first.',
      );
    }

    const clientTz = scheduleDto?.timezone || 'UTC';
    const now = new Date();
    const daysToSchedule = scheduleDto?.daysToSchedule || 3;

    await this.tasksService.closePastScheduledInstances(token, userId);
    await this.tasksService.clearFutureScheduledInstances(token, userId);

    const tasks = await this.tasksService.findAll(token, userId);
    const existingInstances = tasks.flatMap(t => t.instances || []);

    const tasksToSchedule = tasks.filter(t => !['completed', 'archived'].includes(t.status));
    
    tasksToSchedule.sort((a, b) => {
      const pA = this.PRIORITY_WEIGHTS[a.priority] || 0;
      const pB = this.PRIORITY_WEIGHTS[b.priority] || 0;
      if (pB !== pA) return pB - pA;

      const dA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dA - dB;
    });

    const peakHours = this.analyzePeakHours(tasks);
    const hasPeakData = Array.from(peakHours.values()).reduce((a, b) => a + b, 0) > 60;

    const scheduledInstances: any[] = [];

    // Local overlap check helper
    const isSlotAvailable = (start: Date, end: Date): boolean => {
      const s = start.getTime();
      const e = end.getTime();

      // Check against new instances we are placing
      const collidesWithNew = scheduledInstances.some(inst => {
        const iStart = new Date(inst.start).getTime();
        const iEnd = new Date(inst.end).getTime();
        return (s < iEnd && e > iStart);
      });
      if (collidesWithNew) return false;

      // Check against existing instances in DB (completed, manual, etc.)
      const collidesWithExisting = existingInstances.some(inst => {
        const iStart = new Date(inst.start).getTime();
        const iEnd = new Date(inst.end).getTime();
        return (s < iEnd && e > iStart);
      });

      return !collidesWithExisting;
    };

    // 4. Placement Loop
    for (const task of tasksToSchedule) {
      const durationMins = this.parseDuration(task.estimatedTime);
      const repsPerDay = task.targetSessionsPerDay || 1;
      const minSpacingMs = (task.minSpacingMinutes || 60) * 60000;

      for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset++) {
        const dayBase = new Date(now);
        dayBase.setDate(now.getDate() + dayOffset);
        
        // Generate potential 15-min slots for this day
        const daySlots = this.generateScoredSlots(
          dayBase,
          preferences,
          peakHours,
          hasPeakData,
          clientTz,
        );

        // Filter out past slots and sort by productivity score (Peak Hours)
        const candidates = daySlots
          .filter(s => s.time.getTime() > now.getTime())
          .sort((a, b) => b.score - a.score);

        const dayStr = dayBase.toDateString();
        let placedToday = existingInstances.filter(inst => 
          inst.taskId === task.id && new Date(inst.start).toDateString() === dayStr
        ).length;

        for (const candidate of candidates) {
          if (placedToday >= repsPerDay) break;

          const slotStart = candidate.time;
          const slotEnd = new Date(slotStart.getTime() + durationMins * 60000);

          if (task.deadline) {
            const deadlineDate = new Date(task.deadline).getTime();
            if (slotEnd.getTime() > deadlineDate) continue;
          }

          const { end: windowEnd } = this.getAvailableWindow(slotStart, preferences, clientTz);
          if (slotEnd.getTime() > windowEnd.getTime()) continue;

          if (!isSlotAvailable(slotStart, slotEnd)) continue;

          const tStart = slotStart.getTime();

          const tooCloseToNew = scheduledInstances.some(inst => {
            if (inst.taskId !== task.id) return false;
            return Math.abs(new Date(inst.start).getTime() - tStart) < minSpacingMs;
          });
          if (tooCloseToNew) continue;

          const tooCloseToExisting = existingInstances.some(inst => {
            if (inst.taskId !== task.id) return false;
            return Math.abs(new Date(inst.start).getTime() - tStart) < minSpacingMs;
          });
          if (tooCloseToExisting) continue;

          // Commit slot
          scheduledInstances.push({
            taskId: task.id,
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          });
          placedToday++;
        }
      }
    }

    let totalRequestedSessions = 0;
    for (const task of tasksToSchedule) {
      totalRequestedSessions += (task.targetSessionsPerDay || 1) * daysToSchedule;
    }

    const unschedulableCount = Math.max(0, totalRequestedSessions - scheduledInstances.length);

    await this.tasksService.bulkInsertInstances(token, userId, scheduledInstances);

    return {
      scheduledCount: scheduledInstances.length,
      unschedulableCount,
      schedule: scheduledInstances,
    };
  }


  private parseDuration(input: string | number): number {
    if (typeof input === 'number') return input;
    if (!input) return 60;
    let totalMins = 0;
    const hours = input.match(/(\d+(\.\d+)?)h/);
    const mins = input.match(/(\d+)m/);
    if (hours) totalMins += parseFloat(hours[1]) * 60;
    if (mins) totalMins += parseInt(mins[1]);
    if (!hours && !mins && !isNaN(Number(input))) return Number(input);
    return totalMins || 60;
  }

  private analyzePeakHours(tasks: any[]): Map<number, number> {
    const hourScores = new Map<number, number>();
    for (let h = 0; h < 24; h++) hourScores.set(h, 0);
    const allLogs = tasks.flatMap(t => t.history || []);
    allLogs.forEach((log: any) => {
      if (!log.startTime) return;
      const hour = new Date(log.startTime).getHours();
      hourScores.set(hour, (hourScores.get(hour) || 0) + 1);
    });
    return hourScores;
  }

  private generateScoredSlots(
    dayBase: Date,
    preferences: any,
    peakHours: Map<number, number>,
    hasPeakData: boolean,
    tz: string,
  ): { time: Date; score: number }[] {
    const { start, end } = this.getAvailableWindow(dayBase, preferences, tz);
    const slots: { time: Date; score: number }[] = [];
    
    let cursor = new Date(start);
    while (cursor.getTime() < end.getTime()) {
      const hour = this.getHourInTz(cursor, tz);
      // Base score is 5 if no data, otherwise frequency of past success
      const score = hasPeakData ? (peakHours.get(hour) || 0) : 5;
      
      slots.push({ time: new Date(cursor), score });
      cursor.setTime(cursor.getTime() + 15 * 60000); // 15-minute granularity
    }
    return slots;
  }

  private getHourInTz(date: Date, tz: string): number {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).formatToParts(date);
    const hour = parts.find(p => p.type === 'hour')?.value;
    return parseInt(hour || '0');
  }

  private getDayNameInTz(date: Date, tz: string): string {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' }).format(date);
  }

  private setTimeInTz(baseDate: Date, hour: number, minute: number, tz: string): Date {
    const formatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' 
    });
    const parts = formatter.formatToParts(baseDate);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    
    // Create an ISO-like string for the target timezone
    const targetIso = `${y}-${m}-${d}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    const tempUtc = new Date(targetIso + 'Z');
    
    // Adjust by calculating the difference between the created UTC and the desired TZ hour
    const checkHour = this.getHourInTz(tempUtc, tz);
    const diff = hour - checkHour;
    return new Date(tempUtc.getTime() + diff * 3600000);
  }

  private getAvailableWindow(baseDate: Date, preferences: any, tz: string): { start: Date; end: Date } {
    const dayName = this.getDayNameInTz(baseDate, tz);
    const [startStr, endStr] = preferences.availableHours[dayName] || ['09:00', '17:00'];
    
    const [hS, mS] = startStr.split(':').map(Number);
    const [hE, mE] = endStr.split(':').map(Number);

    const start = this.setTimeInTz(baseDate, hS, mS, tz);
    let end = this.setTimeInTz(baseDate, hE, mE, tz);

    if (end.getTime() <= start.getTime()) {
      end.setDate(end.getDate() + 1);
    }
    return { start, end };
  }
}
