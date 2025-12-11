import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NavigationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getFreshClient() {
    const config = this.supabaseService.getConfig();
    // @ts-ignore
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(config.url, config.serviceRoleKey || config.key, {
      auth: { persistSession: false },
    });
  }

  async create(createNavDto: any) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('navigation_menus')
      .insert(createNavDto)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAllBySite(siteId: string) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('navigation_menus')
      .select('*')
      .eq('site_id', siteId)
      .order('updated_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(id: string, updateNavDto: any) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('navigation_menus')
      .update(updateNavDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(id: string) {
    const client = await this.getFreshClient();
    const { error } = await client.from('navigation_menus').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}
