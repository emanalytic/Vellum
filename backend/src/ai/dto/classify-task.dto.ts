import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum SkillLevel {
  TOTAL_NOVICE = 'total_novice',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  MASTER = 'master',
}

export class ClassifyTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, {
    message: 'Task description is too long (max 5000 characters)',
  })
  task_description: string;

  @IsEnum(SkillLevel, {
    message: 'Skill level must be one of: total_novice, beginner, intermediate, advanced, master',
  })
  @IsOptional()
  skill_level?: SkillLevel = SkillLevel.INTERMEDIATE;
}
