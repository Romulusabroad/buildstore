import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subdomain: string;
}

export class UpdateSiteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subdomain?: string;

  @IsOptional()
  @IsString()
  custom_domain?: string;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}
