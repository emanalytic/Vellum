import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpsertTaskDto } from './dto/task.dto';
import { LogProgressDto } from './dto/log-progress.dto';
import { PreferencesDto } from './dto/preferences.dto';
import { Task, UserPreferences } from './types';

@Injectable()
export class TasksService {
  constructor(private readonly supabase: SupabaseService) {}

  private getClient(token: string) {
    return this.supabase.getUserClient(token);
  }

async findAll(token: string, userId: string) {
    const { data: tasksData, error } = await this.getClient(token)
      .from('tasks')
      .select(`*, chunks (*), progress_logs (*), task_instances (*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Tasks findAll error:', error.message);
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }

    return tasksData.map((t: any) => ({
      id: t.id,
      description: t.description,
      skillLevel: t.skill_level,
      priority: t.priority,
      deadline: t.deadline,
      estimatedTime: t.estimated_time,
      status: t.status,
      timeSpent: t.total_time_seconds || 0,
      totalTimeSeconds: t.total_time_seconds || 0,
      scheduledStart: t.scheduled_start,
      scheduledEnd: t.scheduled_end,
      predictedSatisfaction: t.predicted_satisfaction,
      actualSatisfaction: t.actual_satisfaction,
      targetSessionsPerDay: t.target_sessions_per_day || 1,
      minSpacingMinutes: t.min_spacing_minutes || 60,
      chunks: (t.chunks || []).map((c: any) => ({
        id: c.id,
        chunk_name: c.chunk_name,
        duration: c.duration,
        completed: c.completed,
      })),
      instances: (t.task_instances || []).map((inst: any) => ({
        id: inst.id,
        taskId: inst.task_id,
        start: inst.start_time,
        end: inst.end_time,
        status: inst.status,
        actualDurationSeconds: inst.actual_duration_seconds,
      })),
      history: (t.progress_logs || []).map((l: any) => ({
        date: l.created_at,
        startTime: l.start_time,
        endTime: l.end_time,
        durationSeconds: l.duration_seconds,
      })),
    }));
  }

  async upsert(token: string, userId: string, dto: UpsertTaskDto) {
    const client = this.getClient(token);

    const taskPayload: any = {
      user_id: userId,
      description: dto.description,
      skill_level: dto.skillLevel,
      priority: dto.priority,
      deadline: dto.deadline,
      estimated_time: dto.estimatedTime,
      status: dto.status,
      total_time_seconds: dto.totalTimeSeconds ?? dto.timeSpent ?? 0,
      scheduled_start: dto.scheduledStart ?? null,
      scheduled_end: dto.scheduledEnd ?? null,
      predicted_satisfaction: dto.predictedSatisfaction ?? null,
      actual_satisfaction: dto.actualSatisfaction ?? null,
      target_sessions_per_day: dto.targetSessionsPerDay ?? 1,
      min_spacing_minutes: dto.minSpacingMinutes ?? 60,
    };

    if (dto.id) {
      taskPayload.id = dto.id;
    }

    const { data: taskData, error: taskError } = await client
      .from('tasks')
      .upsert(taskPayload)
      .select()
      .single();

    if (taskError) {
      console.error('Task upsert error:', taskError.message);
      throw new InternalServerErrorException('Failed to save task');
    }

    if (dto.chunks && dto.chunks.length > 0) {
      const chunksToUpsert = dto.chunks.map((c) => ({
        id: c.id || undefined,
        task_id: taskData.id,
        chunk_name: c.chunk_name,
        duration: c.duration,
        completed: c.completed ?? false,
      }));

      const { error: chunkError } = await client
        .from('chunks')
        .upsert(chunksToUpsert);

      if (chunkError) {
        console.error('Chunk upsert error:', chunkError.message);
        throw new InternalServerErrorException('Failed to save task chunks');
      }
    }

    return taskData;
  }

  async remove(token: string, userId: string, id: string) {
    const { error } = await this.getClient(token)
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Task delete error:', error.message);
      throw new InternalServerErrorException('Failed to delete task');
    }
    return { success: true };
  }

  async logProgress(
    token: string,
    userId: string,
    taskId: string,
    dto: LogProgressDto,
  ) {
    const client = this.getClient(token);

    const { data: task, error: taskError } = await client
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (taskError || !task) {
      throw new InternalServerErrorException('Task not found or you do not have access');
    }

    const { error } = await client.from('progress_logs').insert({
      user_id: userId,
      task_id: taskId,
      start_time: dto.startTime,
      end_time: dto.endTime,
      duration_seconds: dto.durationSeconds,
    });

    if (error) {
      console.error('Progress log error:', error.message);
      throw new InternalServerErrorException('Failed to save progress log');
    }
    return { success: true };
  }

  async removeChunk(token: string, userId: string, chunkId: string) {
    const client = this.getClient(token);
    const { error } = await client
      .from('chunks')
      .delete()
      .eq('id', chunkId);

    if (error) {
      console.error('Chunk delete error:', error.message);
      throw new InternalServerErrorException('Failed to delete chunk');
    }
    return { success: true };
  }

  async getPreferences(token: string, userId: string) {
    const { data, error } = await this.getClient(token)
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Preferences fetch error:', error.message);
      throw new InternalServerErrorException('Failed to fetch preferences');
    }

    if (!data) return null;

    return {
      availableHours: data.available_hours || {},
      autoSchedule: data.auto_schedule || false,
      soundEnabled: data.sound_enabled ?? true,
    };
  }

  async updatePreferences(token: string, userId: string, dto: PreferencesDto) {
    const { error } = await this.getClient(token)
      .from('user_preferences')
      .upsert({
        user_id: userId,
        available_hours: dto.availableHours,
        auto_schedule: dto.autoSchedule,
        sound_enabled: dto.soundEnabled,
      });

    if (error) {
      console.error('Preferences update error:', error.message);
      throw new InternalServerErrorException('Failed to update preferences');
    }
    return { success: true };
  }

  async closePastScheduledInstances(token: string, userId: string) {
    const now = new Date().toISOString();
    const { error } = await this.getClient(token)
      .from('task_instances')
      .update({ status: 'missed' })
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .lt('end_time', now);

    if (error) {
      console.error('Close past instances error:', error.message);
    }
  }

  async clearFutureScheduledInstances(token: string, userId: string) {
    const now = new Date().toISOString();
    const { error } = await this.getClient(token)
      .from('task_instances')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .gte('start_time', now);

    if (error) {
      console.error('Clear instances error:', error.message);
      throw new InternalServerErrorException('Failed to clear old schedule');
    }
  }

  async bulkInsertInstances(token: string, userId: string, instances: any[]) {
    if (instances.length === 0) return;
    
    const payload = instances.map(inst => ({
      user_id: userId,
      task_id: inst.taskId,
      start_time: inst.start,
      end_time: inst.end,
      status: 'scheduled'
    }));

    const { error } = await this.getClient(token)
      .from('task_instances')
      .insert(payload);

    if (error) {
      console.error('Bulk insert instances error:', error.message);
      throw new InternalServerErrorException('Failed to save new schedule');
    }
  }
}
