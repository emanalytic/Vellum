import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ScheduleDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsNumber()
  @Min(1)
  @Max(90)
  @IsOptional()
  daysToSchedule?: number = 30;

  @IsString()
  @IsOptional()
  timezone?: string = 'UTC';
}
