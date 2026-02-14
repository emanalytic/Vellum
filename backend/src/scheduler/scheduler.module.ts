import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { TasksModule } from '../tasks/tasks.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [TasksModule, SupabaseModule],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
