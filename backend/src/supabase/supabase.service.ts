import {
  Injectable,
  OnModuleDestroy,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleDestroy {
  public readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !anonKey) {
      throw new UnauthorizedException(
        'Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars',
      );
    }
    this.client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }

  getServiceRoleClient(): SupabaseClient {
    const url = this.configService.get<string>('SUPABASE_URL')!;
    const serviceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );
    if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    return createClient(url, serviceKey);
  }

  getUserClient(token: string): SupabaseClient {
    const url = this.configService.get<string>('SUPABASE_URL')!;
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY')!;
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }

  onModuleDestroy() {}
}
