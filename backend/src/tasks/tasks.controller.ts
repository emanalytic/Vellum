import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SupabaseGuard } from '../supabase/supabase.guard';
import { UpsertTaskDto } from './dto/task.dto';
import { LogProgressDto } from './dto/log-progress.dto';
import { PreferencesDto } from './dto/preferences.dto';

@Controller('tasks')
@UseGuards(SupabaseGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(this.extractToken(req), req.user.id);
  }

  @Post()
  upsert(@Req() req: any, @Body() dto: UpsertTaskDto) {
    return this.tasksService.upsert(this.extractToken(req), req.user.id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tasksService.remove(this.extractToken(req), req.user.id, id);
  }

  @Post('log/:taskId')
  logProgress(
    @Req() req: any,
    @Param('taskId') taskId: string,
    @Body() dto: LogProgressDto,
  ) {
    return this.tasksService.logProgress(
      this.extractToken(req),
      req.user.id,
      taskId,
      dto,
    );
  }

  @Get('preferences')
  getPreferences(@Req() req: any) {
    return this.tasksService.getPreferences(
      this.extractToken(req),
      req.user.id,
    );
  }

  @Post('preferences')
  updatePreferences(@Req() req: any, @Body() dto: PreferencesDto) {
    return this.tasksService.updatePreferences(
      this.extractToken(req),
      req.user.id,
      dto,
    );
  }

  private extractToken(req: any): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') throw new UnauthorizedException('No token found');
    return token;
  }
}
