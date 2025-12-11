import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  private supabaseUrl: string;
  private supabaseKey: string;
  private serviceRoleKey: string;

  constructor(private configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    this.supabaseKey = this.configService.get<string>('SUPABASE_KEY') || '';
    this.serviceRoleKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Prioritize Service Role Key over Anon Key
    const keyToUse = this.serviceRoleKey || this.supabaseKey;

    this.supabase = createClient(this.supabaseUrl, keyToUse, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseUrl) {
      this.logger.error('SUPABASE_URL is not defined in environment variables');
      return;
    }

    // 1. Priority: Service Role Key (Bypasses RLS)
    if (serviceRoleKey) {
      this.logger.log(
        `Supabase Client initialized with Service Role Key (RLS Bypassed)`,
      );
      // We don't need to sign in. The client is already admin.
      return;
    }

    this.logger.log(`Supabase Client initialized with URL: ${supabaseUrl}`);

    // 2. Fallback: Global Authentication (System User)
    const email = 'backend-system@buildstore.com';
    const password = 'SystemPassword123!';

    // Try Sign In
    const { data: signInData, error: signInError } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      this.logger.warn(
        `Global Sign In Failed: ${signInError.message}. Attempting Sign Up...`,
      );

      // Try Sign Up
      const { data: signUpData, error: signUpError } =
        await this.supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        this.logger.error(
          `Global Sign Up Failed: ${signUpError.message}. Falling back to Anonymous.`,
        );
        await this.signInAnonymously();
      } else if (!signUpData.session) {
        this.logger.warn(
          `Global Sign Up successful but NO SESSION (Email Confirmation Required). Falling back to Anonymous.`,
        );
        await this.signInAnonymously();
      } else {
        this.logger.log(
          `Global User Signed Up & Session Active: ${signUpData.user?.email}`,
        );
      }
    } else {
      this.logger.log(`Global User Signed In: ${signInData.user?.email}`);
    }
  }

  private async signInAnonymously() {
    const { data: anonData, error: anonError } =
      await this.supabase.auth.signInAnonymously();
    if (anonError) {
      this.logger.error(`Global Anonymous Auth Failed: ${anonError.message}`);
    } else {
      this.logger.log(
        `Global User Signed In Anonymously: ${anonData.user?.id}`,
      );
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getConfig() {
    return {
      url: this.supabaseUrl,
      key: this.supabaseKey,
      serviceRoleKey: this.serviceRoleKey,
    };
  }
}
