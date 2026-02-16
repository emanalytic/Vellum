import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ScheduleDto } from './dto/schedule.dto';
import { Task, TaskInstance, UserPreferences } from '../tasks/types';

interface TimeSlot {
  start: number;
  end: number;
  taskId: string;
}

@Injectable()
export class SchedulerService {
  private readonly PRIORITY_WEIGHTS = { high: 3, medium: 2, low: 1 };
  private readonly SLOT_GRANULARITY_MS = 15 * 60000;
  private readonly DEFAULT_DURATION_MINUTES = 60;
  private readonly DEFAULT_DAYS_TO_SCHEDULE = 3;

  constructor(private readonly tasksService: TasksService) {}

  async scheduleTasks(
    token: string,
    userId: string,
    scheduleDto?: ScheduleDto,
  ) {
    const preferences: any = await this.tasksService.getPreferences(token, userId);
    if (!preferences) {
      throw new InternalServerErrorException(
        'User preferences not found. Please configure your available hours first.',
      );
    }

    const clientTz = scheduleDto?.timezone || 'UTC';
    const now = Date.now();
    const daysToSchedule = scheduleDto?.daysToSchedule || this.DEFAULT_DAYS_TO_SCHEDULE;

    await Promise.all([
      this.tasksService.closePastScheduledInstances(token, userId),
      this.tasksService.clearFutureScheduledInstances(token, userId),
    ]);

    const tasks: any[] = await this.tasksService.findAll(token, userId);
    const activeTasks = tasks.filter(t => !['completed', 'archived'].includes(t.status));
    
    activeTasks.sort((a, b) => {
      const pDiff = (this.PRIORITY_WEIGHTS[b.priority] || 0) - (this.PRIORITY_WEIGHTS[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      const dA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dA - dB;
    });

    const existingSlots = this.buildTimeSlots(tasks.flatMap(t => t.instances || []));
    const peakHours = this.buildPeakHoursMap(tasks, clientTz);

    const { scheduled, unschedulableTasks } = this.fastSchedule(
      activeTasks,
      existingSlots,
      peakHours,
      preferences,
      clientTz,
      now,
      daysToSchedule,
    );

    await this.tasksService.bulkInsertInstances(token, userId, scheduled);

    return {
      scheduledCount: scheduled.length,
      unschedulableCount: unschedulableTasks.length,
      unschedulableTasks,
      schedule: scheduled,
    };
  }

  private buildTimeSlots(instances: any[]): TimeSlot[] {
    return instances.map(inst => ({
      start: new Date(inst.start).getTime(),
      end: new Date(inst.end).getTime(),
      taskId: inst.taskId || inst.task_id,
    }));
  }

  private buildPeakHoursMap(tasks: any[], tz: string): number[] {
    const hours = new Array(24).fill(0);
    for (const task of tasks) {
      for (const log of task.history || []) {
        if (log.startTime) {
          const h = this.getHourInTz(new Date(log.startTime).getTime(), tz);
          hours[h]++;
        }
      }
    }
    return hours;
  }

  private fastSchedule(
    tasks: any[],
    existingSlots: TimeSlot[],
    peakHours: number[],
    preferences: any,
    tz: string,
    now: number,
    days: number,
  ): { scheduled: any[]; unschedulableTasks: string[] } {
    const scheduled: any[] = [];
    const occupiedSlots: TimeSlot[] = [...existingSlots];
    const taskSlots = new Map<string, number[]>();

    const dayWindows = this.precomputeDayWindows(now, days, preferences, tz);
    const hasPeakData = peakHours.reduce((a, b) => a + b, 0) > 0;
    const scoreMap = this.buildScoreMap(peakHours, hasPeakData);

    // Track which tasks got at least one session placed
    const tasksWithPlacements = new Set<string>();

    for (const task of tasks) {
      const duration = this.parseDuration(task.estimatedTime) * 60000;
      const repsPerDay = task.targetSessionsPerDay || 1;
      const minSpacing = (task.minSpacingMinutes || 60) * 60000;

      const taskTimes = taskSlots.get(task.id) || [];
      const existingForTask = existingSlots.filter(s => s.taskId === task.id).map(s => s.start);
      taskTimes.push(...existingForTask);

      // If this task already had existing instances, it's not "unschedulable"
      if (existingForTask.length > 0) {
        tasksWithPlacements.add(task.id);
      }

      for (let day = 0; day < days; day++) {
        const window = dayWindows[day];
        if (!window) continue;

        const dayStart = window.start;
        const dayEnd = window.end;
        const existingToday = taskTimes.filter(t => t >= dayStart && t < dayEnd).length;
        let placedToday = existingToday;

        if (placedToday < repsPerDay) {
          const candidates = this.generateScoredCandidates(
            window.start,
            window.end,
            scoreMap,
            tz,
            now,
          );

          for (const { time, score } of candidates) {
            if (placedToday >= repsPerDay) break;

            const slotEnd = time + duration;
            if (slotEnd > window.end) continue;

            if (task.deadline) {
              const deadlineDate = new Date(task.deadline).getTime();
              if (slotEnd > deadlineDate) continue;
            }

            if (this.hasCollision(time, slotEnd, occupiedSlots)) continue;
            if (this.violatesSpacing(time, taskTimes, minSpacing)) continue;

            const slot = { start: time, end: slotEnd, taskId: task.id };
            occupiedSlots.push(slot);
            taskTimes.push(time);
            
            scheduled.push({
              taskId: task.id,
              start: new Date(time).toISOString(),
              end: new Date(slotEnd).toISOString(),
            });

            placedToday++;
            tasksWithPlacements.add(task.id);
          }
        }

        taskSlots.set(task.id, taskTimes);
      }
    }

    // Only tasks that got ZERO placements anywhere are truly unschedulable
    const unschedulableTasks = tasks
      .filter(t => !tasksWithPlacements.has(t.id))
      .map(t => t.description || t.id);

    return { scheduled, unschedulableTasks };
  }

  private precomputeDayWindows(
    now: number,
    days: number,
    preferences: any,
    tz: string,
  ): Array<{ start: number; end: number; day: string }> {
    const windows: Array<{ start: number; end: number; day: string }> = [];
    const DAY_MS = 86400000;
    
    for (let i = 0; i < days; i++) {
        // Use a date that is clearly in the user's i-th day
        // date.getDay() or getDayName needs to be consistent
        const date = new Date(now + i * DAY_MS);
        const dayName = this.getDayName(date, tz);
        const hostHours = preferences.availableHours[dayName] || ['09:00', '17:00'];
        const [startH, startM, endH, endM] = this.parseTimeRange(hostHours);

        const start = this.getTimestamp(date, startH, startM, tz);
        let end = this.getTimestamp(date, endH, endM, tz);
        
        if (end <= start) end += DAY_MS;

        windows.push({ start, end, day: dayName });
    }

    return windows;
  }

  private buildScoreMap(peakHours: number[], hasPeakData: boolean): Map<number, number> {
    const map = new Map<number, number>();
    for (let h = 0; h < 24; h++) {
      map.set(h, hasPeakData ? peakHours[h] || 0 : 5);
    }
    return map;
  }

  private generateScoredCandidates(
    start: number,
    end: number,
    scoreMap: Map<number, number>,
    tz: string,
    now: number,
  ): Array<{ time: number; score: number }> {
    const candidates: Array<{ time: number; score: number }> = [];
    let time = start;

    while (time < end) {
      if (time > now) {
        const hour = this.getHourInTz(time, tz);
        candidates.push({
          time,
          score: scoreMap.get(hour) || 0,
        });
      }
      time += this.SLOT_GRANULARITY_MS;
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates;
  }

  private hasCollision(start: number, end: number, slots: TimeSlot[]): boolean {
    for (const slot of slots) {
      if (start < slot.end && end > slot.start) return true;
    }
    return false;
  }

  private violatesSpacing(time: number, taskTimes: number[], minSpacing: number): boolean {
    for (const t of taskTimes) {
      if (Math.abs(time - t) < minSpacing) return true;
    }
    return false;
  }

  private parseTimeRange(range: [string, string]): [number, number, number, number] {
    const [sh, sm] = range[0].split(':').map(Number);
    const [eh, em] = range[1].split(':').map(Number);
    return [sh, sm, eh, em];
  }

  private getHourInTz(timestamp: number, tz: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(new Date(timestamp));
    const hStr = parts.find(p => p.type === 'hour')?.value || '0';
    let h = parseInt(hStr, 10);
    if (h === 24) h = 0;
    return h;
  }

  private getTimestamp(date: Date, hour: number, minute: number, tz: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', { 
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' 
    });
    const parts = formatter.formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    
    // Create UTC-normalized date string for the target TZ
    const targetIso = `${y}-${m}-${d}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    const tempUtc = new Date(targetIso + 'Z');
    
    // Calculate the drift by checking what hour that UTC timestamp represents in the target TZ
    const checkHour = this.getHourInTz(tempUtc.getTime(), tz);
    
    const diff = hour - checkHour;
    return tempUtc.getTime() + diff * 3600000;
  }

  private getDayName(date: Date, tz: string): string {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' }).format(date);
    } catch {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    }
  }

  private parseDuration(input: string | number): number {
    if (typeof input === 'number') return input;
    if (!input) return this.DEFAULT_DURATION_MINUTES;

    const hMatch = input.match(/(\d+(?:\.\d+)?)h/);
    const mMatch = input.match(/(\d+)m/);
    
    let total = 0;
    if (hMatch) total += parseFloat(hMatch[1]) * 60;
    if (mMatch) total += parseInt(mMatch[1], 10);
    if (!hMatch && !mMatch && !isNaN(Number(input))) return Number(input);
    
    return total || this.DEFAULT_DURATION_MINUTES;
  }

}