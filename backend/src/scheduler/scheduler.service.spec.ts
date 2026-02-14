import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { TasksService } from '../tasks/tasks.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let tasksService: Partial<TasksService>;

  const mockTasks = [
    {
      id: 'task-1',
      description: 'Task 1',
      priority: 'high',
      deadline: '2026-03-01T12:00:00Z',
      estimatedTime: '60',
      status: 'idle',
    },
    {
      id: 'task-2',
      description: 'Task 2',
      priority: 'medium',
      deadline: '2026-03-02T12:00:00Z',
      estimatedTime: '1h 30m',
      status: 'idle',
    },
    {
      id: 'task-3',
      description: 'Previously Scheduled',
      priority: 'low',
      deadline: '2026-03-03T12:00:00Z',
      estimatedTime: '30',
      status: 'idle',
      scheduledStart: new Date(Date.now() + 86400000).toISOString(),
      scheduledEnd: new Date(Date.now() + 86400000 + 1800000).toISOString(),
    },
  ];

  const mockPreferences = {
    availableHours: {
      Monday: ['09:00', '17:00'],
      Tuesday: ['09:00', '17:00'],
      Wednesday: ['09:00', '17:00'],
      Thursday: ['09:00', '17:00'],
      Friday: ['09:00', '17:00'],
      Saturday: ['10:00', '14:00'],
      Sunday: ['10:00', '14:00'],
    },
    autoSchedule: true,
  };

  beforeEach(async () => {
    tasksService = {
      findAll: jest.fn().mockResolvedValue(mockTasks),
      getPreferences: jest.fn().mockResolvedValue(mockPreferences),
      upsert: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: TasksService, useValue: tasksService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule tasks correctly', async () => {
    const result = await service.scheduleTasks('token', 'user-1', {
      daysToSchedule: 7,
    });
    expect(result.scheduledCount).toBeGreaterThan(0);
    expect(result.unschedulableCount).toBe(0);
    expect(tasksService.upsert).toHaveBeenCalled();
  });

  it('should produce deterministic schedules', async () => {
    const run1 = await service.scheduleTasks('token', 'user-1', {
      daysToSchedule: 5,
    });
    (tasksService.upsert as jest.Mock).mockClear();
    const run2 = await service.scheduleTasks('token', 'user-1', {
      daysToSchedule: 5,
    });

    const ids1 = run1.schedule.map((t) => t.id).sort();
    const ids2 = run2.schedule.map((t) => t.id).sort();
    expect(ids1).toEqual(ids2);
  });

  it('should preserve manually scheduled tasks', async () => {
    const result = await service.scheduleTasks('token', 'user-1');
    const task3 = result.schedule.find((t) => t.id === 'task-3');
    expect(task3).toBeDefined();
    expect(task3!.start).toBe(mockTasks[2].scheduledStart);
  });

  it('should flag unschedulable tasks', async () => {
    const bigTask = {
      id: 'task-impossible',
      description: 'Impossible',
      priority: 'low',
      deadline: '2026-03-05T12:00:00Z',
      estimatedTime: '24h',
      status: 'idle',
    };
    (tasksService.findAll as jest.Mock).mockResolvedValue([bigTask]);

    const result = await service.scheduleTasks('token', 'user-1', {
      daysToSchedule: 2,
    });
    expect(result.unschedulableCount).toBe(1);
    expect(result.unschedulableIds).toContain('task-impossible');
  });
});
