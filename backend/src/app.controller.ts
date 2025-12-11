import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('create-test-user')
  async createTestUser() {
    // 1. Try to list existing users (requires Service Role Key)
    try {
      const { data: users, error: listError } = await this.supabaseService
        .getClient()
        .auth.admin.listUsers();
      if (users && users.users.length > 0) {
        return { message: 'Found existing user', id: users.users[0].id };
      }
    } catch (e) {
      // Ignore, probably not service role key
    }

    // 2. Try Anonymous Sign In (often allowed in dev)
    const { data: anonData, error: anonError } = await this.supabaseService
      .getClient()
      .auth.signInAnonymously();
    if (anonData?.user) {
      return { message: 'Anonymous user created', id: anonData.user.id };
    }

    // 3. Try to signup with a realistic email (Fallback)
    const email = `admin-${Date.now()}@buildstore.com`;
    const password = 'StrongPassword123!';

    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      // If already exists (or other error), try signing in
      const { data: signinData, error: signinError } =
        await this.supabaseService.getClient().auth.signInWithPassword({
          email: 'admin-1733607710953@buildstore.com', // Use a known email if we can, or just generic admin
          password: 'StrongPassword123!',
        });

      if (!signinError && signinData.session) {
        return {
          message: 'User Signed In',
          user: signinData.user,
          id: signinData.user?.id,
        };
      }

      return {
        error: error.message,
        anonError: anonError?.message,
        signinError: signinError?.message,
      };
    }

    // If signup success, we are signed in automatically?
    // Supabase auto-signs in on signUp usually.
    return {
      message: 'User created & Signed In',
      user: data.user,
      id: data.user?.id,
    };
  }
}
