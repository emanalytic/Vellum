import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum SkillLevel {
  TOTAL_NOVICE = 'total_novice',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  MASTER = 'master',
}

export class TaskChunkDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  chunk_name: string;

  @IsInt()
  @Min(0)
  duration: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class UpsertTaskDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  skillLevel?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  estimatedTime?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalTimeSeconds?: number;

  @IsDateString()
  @IsOptional()
  scheduledStart?: string;

  @IsDateString()
  @IsOptional()
  scheduledEnd?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskChunkDto)
  @IsOptional()
  chunks?: TaskChunkDto[];

  @IsInt()
  @Min(0)
  @IsOptional()
  predictedSatisfaction?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  actualSatisfaction?: number;

  @IsInt()
  @IsOptional()
  timeSpent?: number;

  @IsArray()
  @IsOptional()
  history?: any[];
}
