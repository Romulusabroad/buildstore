import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@Injectable()
@Injectable()
export class PagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async getFreshClient() {
    const config = this.supabaseService.getConfig();
    // @ts-ignore
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(config.url, config.serviceRoleKey || config.key, {
      auth: { persistSession: false },
    });
  }

  async create(createPageDto: CreatePageDto) {
    // Use Global Singleton Client - Pages table has no owner_id, just insert directly
    // DEBUG: Creating fresh client to avoid SocketError
    const tempClient = await this.getFreshClient();

    const { data, error } = await tempClient
      .from('pages')
      .insert(createPageDto)
      .select()
      .single();

    if (error) {
      console.error('Page Creation Error:', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async findAllBySite(siteId: string) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .order('updated_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const client = await this.getFreshClient();
    const { data, error } = await client
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    const client = await this.getFreshClient();

    // 1. Fetch current page to check for slug change
    const { data: oldPage, error: fetchError } = await client
      .from('pages')
      .select('slug, site_id')
      .eq('id', id)
      .single();

    if (fetchError) throw new InternalServerErrorException(fetchError.message);

    // 2. Update page
    const { data, error } = await client
      .from('pages')
      .update(updatePageDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);

    // 3. If slug changed, create redirect
    if (updatePageDto.slug && oldPage.slug !== updatePageDto.slug) {
      const { error: redirectError } = await client
        .from('redirects')
        .insert({
          site_id: oldPage.site_id,
          from_path: oldPage.slug,
          to_path: updatePageDto.slug,
          type: '301',
        });

      if (redirectError) {
        console.error('Failed to create automatic redirect:', redirectError);
        // We don't throw here to avoid rolling back the page update, but we log it.
        // Ideally this should be a transaction.
      }
    }

    return data;
  }

  async remove(id: string) {
    const client = await this.getFreshClient();
    
    // Check if deletable
    const { data: page, error: fetchError } = await client
      .from('pages')
      .select('is_deletable')
      .eq('id', id)
      .single();
      
    if (fetchError) throw new InternalServerErrorException(fetchError.message);
    if (page && page.is_deletable === false) {
      throw new InternalServerErrorException('This page is a system page and cannot be deleted.');
    }

    const { error } = await client.from('pages').delete().eq('id', id);
    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}
