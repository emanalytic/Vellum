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
  @Max(14)
  @IsOptional()
  daysToSchedule?: number = 3;

  @IsString()
  @IsOptional()
  timezone?: string = 'UTC';
}
