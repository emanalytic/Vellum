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
}

export interface UserPreferences {
  availableHours: { [key: string]: string[] };
  autoSchedule: boolean;
}

export interface SchedulerResult {
  scheduledCount: number;
  unschedulableCount: number;
  unschedulableIds: string[];
  schedule: { id: string; start: string; end: string }[];
}
