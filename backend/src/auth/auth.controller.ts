import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseGuard } from '../supabase/supabase.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(SupabaseGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }
}
