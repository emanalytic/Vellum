import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum WorkloadType {
  LINEAR_READING = 'linear_reading',
  PROBLEM_SOLVING = 'problem_solving',
  RECALL_MEMORIZATION = 'recall_memorization',
  PRODUCTION_WRITING = 'production_writing',
  PROCEDURAL_EXECUTION = 'procedural_execution',
  EXPLORATORY_LEARNING = 'exploratory_learning',
}

export enum Intensity {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

export enum VarianceProfile {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

export class TaskChunkDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  estimated_duration_min: number;
}

export class TaskClassificationDto {
  @IsEnum(WorkloadType)
  workload_type: WorkloadType;

  @IsEnum(Intensity)
  intensity: Intensity;

  @IsInt()
  @Min(1)
  baseline_duration_min: number;

  @IsEnum(VarianceProfile)
  variance_profile: VarianceProfile;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskChunkDto)
  suggested_chunks: TaskChunkDto[];

  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;
}
