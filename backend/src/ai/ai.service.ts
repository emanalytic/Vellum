import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ClassifyTaskDto } from './dto/classify-task.dto';
import { TaskClassificationDto } from './dto/task-classification.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    const apiKey = this.configService.get<string>('API_KEY');
    if (!apiKey) {
      console.warn('API_KEY is not set. AI features will fail.');
    }
    this.groq = new Groq({ apiKey });
  }

  async classifyTask(
    dto: ClassifyTaskDto,
    userId: string,
    token: string,
  ): Promise<TaskClassificationDto> {
    try {
      // check Daily Limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userClient = this.supabaseService.getUserClient(token);
      const { count, error: countError } = await userClient
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());

      if (countError) {
        console.error('Error checking AI limit:', countError.message);
      } else if (count !== null && count >= 3) {
        throw new Error('DAILY_LIMIT_REACHED');
      }

      const { task_description, skill_level } = dto;

      const systemPrompt = `You are a task time-behavior classifier.
Your Goal: Map natural-language tasks to workload patterns and break them down into concrete, actionable chunks (max 5).
Output: Strict JSON matching the schema below. No chatter.

Schema:
{
  "suggested_chunks": [
    { "title": "string", "description": "string", "estimated_duration_min": integer }
  ]
}

Scale calibration for skill_level '${skill_level}':
- beginner/total_novice: Multiply generic durations by 1.5x. Provide more granular chunks.
- intermediate/average: Baselines.
- advanced/master/expert: Multiply generic durations by 0.7x. Chunks can be broader.

Constraints:
- suggested_chunks: Min 1, Max 5.`;

      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Task: ${task_description}\nSkill Level: ${skill_level}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      const rawData = JSON.parse(content);

      if (!Array.isArray(rawData.suggested_chunks)) {
        rawData.suggested_chunks = [];
      }
      if (rawData.suggested_chunks.length > 5) {
        rawData.suggested_chunks = rawData.suggested_chunks.slice(0, 5);
      }

      // 2. Record Usage
      await userClient.from('ai_usage').insert({
        user_id: userId,
      });

      return rawData as TaskClassificationDto;
    } catch (error: any) {
      if (error.message === 'DAILY_LIMIT_REACHED') {
        throw new HttpException(
          'Daily AI limit reached (3 tasks per day). Try again tomorrow!',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      console.error('AI Classification Error:', error.message);
      throw new InternalServerErrorException(
        'AI classification service is temporarily unavailable. Please try again.',
      );
    }
  }
}
