import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { SupabaseGuard } from '../supabase/supabase.guard';
import { ClassifyTaskDto } from './dto/classify-task.dto';

@Controller('ai')
@UseGuards(SupabaseGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('classify-task')
  async classifyTask(@Body() dto: ClassifyTaskDto) {
    return this.aiService.classifyTask(dto);
  }
}
