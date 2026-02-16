export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "archived";

export interface TaskChunk {
  id: string;
  chunk_name: string;
  duration: number;
  completed: boolean;
}

export interface TaskHistory {
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
}

export interface Task {
  id: string;
  description: string;
  skillLevel: string;
  priority: TaskPriority;
  deadline: string;
  estimatedTime: string;
  status: TaskStatus;
  timeSpent: number;
  chunks?: TaskChunk[];
  history: TaskHistory[];
  totalTimeSeconds: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  predictedSatisfaction?: number;
  actualSatisfaction?: number;
  targetSessionsPerDay?: number;
  minSpacingMinutes?: number;
  instances?: TaskInstance[];
}

export interface TaskInstance {
  id: string;
  start: string;
  end: string;
  status: 'scheduled' | 'completed' | 'missed' | 'skipped';
  actualDurationSeconds?: number;
}

export interface UserPreferences {
  availableHours: { [key: string]: string[] };
  autoSchedule: boolean;
  soundEnabled: boolean;
}

export interface SchedulerResult {
  scheduledCount: number;
  unschedulableCount: number;
  schedule: { taskId: string; start: string; end: string }[];
}
