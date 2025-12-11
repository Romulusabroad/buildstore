import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RedirectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getFreshClient() {
    const config = this.supabaseService.getConfig();
    // @ts-ignore
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(config.url, config.serviceRoleKey || config.key, {
      auth: { persistSession: false },
    });
  }

  async create(createRedirectDto: any) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('redirects')
      .insert(createRedirectDto)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAllBySite(siteId: string) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('redirects')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string) {
    const client = await this.getFreshClient();
    const { error } = await client.from('redirects').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}
