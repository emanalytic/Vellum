import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class LogProgressDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsInt()
  @Min(0)
  durationSeconds: number;
}
