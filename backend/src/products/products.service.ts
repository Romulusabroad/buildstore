
import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

dotenv.config();

@Injectable()
export class ProductsService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be defined in environment');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Helper to ensure fresh client if needed, or simply use the service instance
  private get db() {
    return this.supabase;
  }

  async create(createProductDto: CreateProductDto) {
    const { data, error } = await this.db
      .from('products')
      .insert(createProductDto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAllBySite(siteId: string) {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async findOneBySlug(siteId: string, slug: string) {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .eq('site_id', siteId)
      .eq('slug', slug)
      .single();

    if (error || !data) throw new NotFoundException('Product not found by slug');
    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { data, error } = await this.db
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.db
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  }
}
