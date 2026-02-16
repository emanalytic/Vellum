import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskChunkDto)
  suggested_chunks: TaskChunkDto[];

}
