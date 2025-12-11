import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreatePageDto {
  @IsUUID()
  @IsNotEmpty()
  site_id: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  content: any; // JSONB

  @IsOptional()
  @IsString()
  status?: 'draft' | 'published' | 'scheduled' | 'archived';

  @IsOptional()
  @IsString()
  scheduled_at?: string;

  @IsOptional()
  @IsUUID()
  folder_id?: string;

  @IsOptional()
  @IsString()
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_description?: string;

  @IsOptional()
  @IsString()
  social_image?: string;

  @IsOptional()
  @IsObject()
  schema_markup?: any;

  @IsOptional()
  @IsString()
  type?: 'landing' | 'system' | 'template';

  @IsOptional()
  @IsString()
  entity_type?: string;
}

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: any;

  @IsOptional()
  @IsString()
  status?: 'draft' | 'published' | 'scheduled' | 'archived';

  @IsOptional()
  @IsString()
  scheduled_at?: string;

  @IsOptional()
  @IsUUID()
  folder_id?: string;

  @IsOptional()
  @IsString()
  seo_title?: string;

  @IsOptional()
  @IsString()
  seo_description?: string;

  @IsOptional()
  @IsString()
  social_image?: string;

  @IsOptional()
  @IsObject()
  schema_markup?: any;

  @IsOptional()
  @IsString()
  type?: 'landing' | 'system' | 'template';

  @IsOptional()
  @IsString()
  entity_type?: string;
}
