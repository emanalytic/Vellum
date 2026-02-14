import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class PreferencesDto {
  @IsBoolean()
  @IsOptional()
  autoSchedule?: boolean;

  @IsObject()
  @IsOptional()
  availableHours?: Record<string, any>;
}
