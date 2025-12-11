import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';

@Injectable()
export class SitesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async create(createSiteDto: CreateSiteDto, ownerId: string) {
    // Use Global Singleton Client
    const {
      data: { user },
    } = await this.client.auth.getUser();

    let actualOwnerId = user?.id;

    // If no authenticated user (e.g. Service Role), we must find a valid User ID for the Foreign Key
    if (!actualOwnerId) {
      // Check if we are using Service Role (Admin)
      const {
        data: { users },
        error: listError,
      } = await this.client.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (users && users.length > 0) {
        console.log('DEBUG: Found real users provided by Auth Admin:', users.length);
        console.log('DEBUG: User 0 ID:', users[0].id);
        
        // Fix: Use the MOCK ID if it was passed! 
        if (ownerId) {
             console.log('DEBUG: Using provided ownerId (Mock) instead of Service User:', ownerId);
             actualOwnerId = ownerId;
        } else {
             actualOwnerId = users[0].id;
        }
      } else {
        // Fallback to ownerId (likely Mock) or fail
        actualOwnerId = ownerId;
        console.warn(
          'Service Role active but no users found. Using provided ID:',
          actualOwnerId,
        );
      }
    }

    const { data, error } = await this.client
      .from('sites')
      .insert({ ...createSiteDto, owner_id: actualOwnerId })
      .select()
      .single();

    if (error) {
      console.error('Site Creation Error:', error);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const { data, error } = await this.client
      .from('sites')
      .update(updateSiteDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
       console.error('Site Update Error:', error);
       throw new InternalServerErrorException(error.message);
    }
    return data;
  }



  async findByDomain(domain: string) {
    // Check custom_domain first
    const { data: customData } = await this.client
      .from('sites')
      .select('*')
      .eq('custom_domain', domain)
      .single();

    if (customData) return customData;

    // Check subdomain (domain = "sub.buildstore.com" -> we check "sub")
    // If input is "mysite", we check "mysite". 
    // Usually domain routing passes the full host.
    
    // For now, let's assume if it doesn't match custom_domain, we check if it is a subdomain
    // But we need to be careful.
    
    // Simple look up for subdomain match
    const { data: subData } = await this.client
        .from('sites')
        .select('*')
        .eq('subdomain', domain)
        .single();
        
    if (!subData) {
      throw new NotFoundException('Site not found');
    }
        
    return subData;
  }

  async findAll(ownerId: string) {
    try {
      console.log('DEBUG: findAll called with ownerId:', ownerId);

      const client = this.client;
      if (!client) {
        throw new Error('Supabase client is null/undefined');
      }

      const { data, error } = await client
        .from('sites')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase Error:', error);
        throw new BadRequestException({
          message: 'Supabase Error',
          details: error,
        });
      }
      return data;
    } catch (err) {
      console.error('CRITICAL EXCEPTION:', err);
      throw new BadRequestException({
        message: 'Critical Exception',
        error: err.toString(),
        stack: err.stack,
      });
    }
  }

  async findOne(id: string) {
    const { data, error } = await this.client
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    // Note: RLS will ensure users only see their own sites if configured correctly,
    // but explicit owner check in query is also good practice if we passed ownerId.

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
