import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ClassifyTaskDto } from './dto/classify-task.dto';
import { TaskClassificationDto } from './dto/task-classification.dto';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      console.warn('GROQ_API_KEY is not set. AI features will fail.');
    }
    this.groq = new Groq({ apiKey });
  }

  async classifyTask(dto: ClassifyTaskDto): Promise<TaskClassificationDto> {
    try {
      const { task_description, skill_level } = dto;

      const systemPrompt = `You are a task time-behavior classifier.
Your Goal: Map natural-language tasks to workload patterns and break them down into concrete, actionable chunks (max 5).
Output: Strict JSON matching the schema below. No chatter.

Schema:
{
  "workload_type": "linear_reading" | "problem_solving" | "recall_memorization" | "production_writing" | "procedural_execution" | "exploratory_learning",
  "intensity": "light" | "medium" | "heavy",
  "baseline_duration_min": integer (1-480),
  "variance_profile": "low" | "moderate" | "high",
  "suggested_chunks": [
    { "title": "string", "description": "string", "estimated_duration_min": integer }
  ],
  "confidence": number (0-1)
}

Scale calibration for skill_level '${skill_level}':
- beginner/total_novice: Multiply generic durations by 1.5x. Provide more granular chunks.
- intermediate/average: Baselines.
- advanced/master/expert: Multiply generic durations by 0.7x. Chunks can be broader.

Constraints:
- suggested_chunks: Min 1, Max 5.
- confidence: Reflect how ambiguous the task is.`;

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

      rawData.baseline_duration_min = Math.max(
        1,
        Number(rawData.baseline_duration_min) || 15,
      );
      rawData.confidence = Math.min(
        1,
        Math.max(0, Number(rawData.confidence) || 0.5),
      );

      return rawData as TaskClassificationDto;
    } catch (error: any) {
      console.error('AI Classification Error:', error.message);
      throw new InternalServerErrorException(
        'AI classification service is temporarily unavailable. Please try again.',
      );
    }
  }
}
