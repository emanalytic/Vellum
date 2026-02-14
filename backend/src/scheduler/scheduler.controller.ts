import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SupabaseGuard } from '../supabase/supabase.guard';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('scheduler')
@UseGuards(SupabaseGuard)
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('schedule')
  async schedule(@Req() req: any, @Body() dto: ScheduleDto) {
    const token = this.extractToken(req);
    return this.schedulerService.scheduleTasks(token, req.user.id, dto);
  }

  private extractToken(req: any): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') throw new UnauthorizedException('No token found');
    return token;
  }
}
