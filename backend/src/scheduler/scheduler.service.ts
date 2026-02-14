import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulerService {
  constructor(private readonly tasksService: TasksService) {}

  private PRIORITY_WEIGHT: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  async scheduleTasks(
    token: string,
    userId: string,
    scheduleDto?: ScheduleDto,
  ) {
    const tasks = await this.tasksService.findAll(token);
    const preferences = await this.tasksService.getPreferences(token, userId);

    if (!preferences) {
      throw new InternalServerErrorException(
        'User preferences not found. Please set your available hours first.',
      );
    }

    const clientTz =
      scheduleDto?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const allTasks = tasks.map((t: any) => ({ ...t }));
    const now = new Date();

    const manuallyScheduled = allTasks.filter(
      (t: any) =>
        !['completed', 'archived'].includes(t.status) &&
        t.scheduledStart &&
        t.scheduledEnd &&
        new Date(t.scheduledStart).getTime() > now.getTime(),
    );

    const tasksToSchedule = allTasks.filter(
      (t: any) =>
        !['completed', 'archived'].includes(t.status) &&
        (!t.scheduledStart ||
          !t.scheduledEnd ||
          new Date(t.scheduledStart).getTime() <= now.getTime()),
    );

    const peakHours = this.analyzePeakHours(allTasks);
    const totalLoggedMins = Array.from(peakHours.values()).reduce(
      (a, b) => a + b,
      0,
    );
    const hasPeakData = totalLoggedMins > 60;

    tasksToSchedule.sort((a: any, b: any) => {
      const pDiff =
        (this.PRIORITY_WEIGHT[b.priority] || 1) -
        (this.PRIORITY_WEIGHT[a.priority] || 1);
      if (pDiff !== 0) return pDiff;

      const deadlineA = a.deadline
        ? new Date(a.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;
      const deadlineB = b.deadline
        ? new Date(b.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;
      const deadlineDiff = deadlineA - deadlineB;
      if (deadlineDiff !== 0) return deadlineDiff;

      return a.id.localeCompare(b.id);
    });

    const scheduledResults = [...manuallyScheduled];

    const hasOverlap = (slotStart: Date, slotEnd: Date): boolean => {
      return scheduledResults.some((t: any) => {
        if (!t.scheduledStart || !t.scheduledEnd) return false;
        const s = new Date(t.scheduledStart).getTime();
        const e = new Date(t.scheduledEnd).getTime();
        return slotStart.getTime() < e && slotEnd.getTime() > s;
      });
    };

    const MAX_DAYS_AHEAD = scheduleDto?.daysToSchedule || 30;

    const dailySlots = new Map<number, { time: Date; score: number }[]>();
    for (let dayOffset = 0; dayOffset < MAX_DAYS_AHEAD; dayOffset++) {
      const dayBase = new Date(now);
      dayBase.setDate(now.getDate() + dayOffset);
      dailySlots.set(
        dayOffset,
        this.generateScoredSlots(
          dayBase,
          preferences,
          peakHours,
          hasPeakData,
          clientTz,
        ),
      );
    }

    const unschedulable: string[] = [];

    for (const task of tasksToSchedule) {
      const durationMin = this.parseDuration(task.estimatedTime);
      let slotFound = false;

      for (
        let dayOffset = 0;
        dayOffset < MAX_DAYS_AHEAD && !slotFound;
        dayOffset++
      ) {
        const candidates = dailySlots.get(dayOffset) || [];
        const validCandidates = candidates
          .filter((c) => c.time.getTime() >= now.getTime())
          .sort((a, b) => b.score - a.score);

        for (const candidate of validCandidates) {
          const potentialEnd = new Date(
            candidate.time.getTime() + durationMin * 60000,
          );
          const { end: windowEnd } = this.getAvailableWindow(
            candidate.time,
            preferences,
            clientTz,
          );

          if (potentialEnd.getTime() > windowEnd.getTime()) continue;
          if (hasOverlap(candidate.time, potentialEnd)) continue;

          task.scheduledStart = candidate.time.toISOString();
          task.scheduledEnd = potentialEnd.toISOString();
          scheduledResults.push(task);
          slotFound = true;
          break;
        }
      }

      if (!slotFound) {
        unschedulable.push(task.id);
      }
    }

    const tasksToUpdate = scheduledResults.filter(
      (t: any) =>
        !['completed', 'archived'].includes(t.status) &&
        !manuallyScheduled.find((m: any) => m.id === t.id),
    );

    await Promise.all(
      tasksToUpdate.map((task) =>
        this.tasksService
          .upsert(token, userId, task)
          .catch((err) =>
            console.error(`Failed to upsert task ${task.id}`, err),
          ),
      ),
    );

    return {
      scheduledCount: tasksToUpdate.length,
      unschedulableCount: unschedulable.length,
      unschedulableIds: unschedulable,
      schedule: scheduledResults.map((t) => ({
        id: t.id,
        start: t.scheduledStart,
        end: t.scheduledEnd,
      })),
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

    if (!hours && !mins && !isNaN(Number(input))) {
      return Number(input);
    }

    return totalMins || 60;
  }

  private analyzePeakHours(tasks: any[]): Map<number, number> {
    const hourScores = new Map<number, number>();
    for (let h = 0; h < 24; h++) hourScores.set(h, 0);

    const allLogs = tasks.flatMap((t) => t.history || []);
    if (allLogs.length === 0) return hourScores;

    allLogs.forEach((log: any) => {
      if (!log.startTime || !log.durationSeconds) return;
      const startDate = new Date(log.startTime);
      const startHour = startDate.getHours();
      hourScores.set(startHour, (hourScores.get(startHour) || 0) + 1);
    });

    return hourScores;
  }

  /**
   * Converts a Date to the hour in the given IANA timezone.
   * e.g., getHourInTz(someUTCDate, 'Asia/Karachi') => 14
   */
  private getHourInTz(date: Date, tz: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(date);
    const hourPart = parts.find((p) => p.type === 'hour');
    return parseInt(hourPart?.value || '0');
  }

  /**
   * Gets the day name (e.g., "Monday") for a Date in the given timezone.
   */
  private getDayNameInTz(date: Date, tz: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'long',
    }).format(date);
  }

  /**
   * Creates a Date object representing a specific hour:minute in the given timezone on the given base date.
   * This is the key function — it ensures "09:00 in Asia/Karachi" produces the correct UTC instant.
   */
  private setHoursInTz(
    baseDate: Date,
    hours: number,
    minutes: number,
    tz: string,
  ): Date {
    // Get the date parts in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(baseDate);
    const year = parseInt(
      parts.find((p) => p.type === 'year')?.value || '2026',
    );
    const month = parseInt(parts.find((p) => p.type === 'month')?.value || '1');
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1');

    // Build an ISO string that represents this datetime in the target timezone
    // We calculate the UTC offset for this timezone at this particular date
    const targetStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    // Create a date assuming UTC, then adjust by the timezone offset
    const tempUtc = new Date(targetStr + 'Z');
    // Find what hour this tempUtc maps to in the target timezone
    const tzHour = this.getHourInTz(tempUtc, tz);
    // Difference tells us the offset in hours
    const offsetHours = hours - tzHour;
    // Adjust
    const adjustedMs = tempUtc.getTime() + offsetHours * 3600000;

    return new Date(adjustedMs);
  }

  private getAvailableWindow(
    baseDate: Date,
    preferences: any,
    tz: string,
  ): { start: Date; end: Date } {
    const dayName = this.getDayNameInTz(baseDate, tz);
    const availableRange = preferences.availableHours[dayName] || [
      '09:00',
      '17:00',
    ];
    const [startStr, endStr] = availableRange;

    const [hS, mS] = startStr.split(':').map(Number);
    const [hE, mE] = endStr.split(':').map(Number);

    const start = this.setHoursInTz(baseDate, hS, mS, tz);
    const end = this.setHoursInTz(baseDate, hE, mE, tz);

    if (end.getTime() <= start.getTime()) {
      // If end is before start (overnight), it means the window extends into the next day
      end.setDate(end.getDate() + 1);
      return { start, end };
    }

    return { start, end };
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
      const score = hasPeakData ? peakHours.get(hour) || 0 : 5;

      slots.push({ time: new Date(cursor), score });
      cursor.setTime(cursor.getTime() + 15 * 60000);
    }

    return slots;
  }
}
