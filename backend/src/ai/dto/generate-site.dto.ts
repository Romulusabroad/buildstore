import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class GenerateSiteDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsArray()
  @IsOptional()
  sections?: string[];

  // Business Context Parameters
  @IsString()
  @IsOptional()
  @IsIn(['saas', 'fashion', 'food', 'beauty', 'home', 'services'])
  industry?: string;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  @IsOptional()
  productDescription?: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  @IsIn(['cost', 'premium', 'innovation', 'trust', 'efficiency'])
  competitiveStrategy?:
    | 'cost'
    | 'premium'
    | 'innovation'
    | 'trust'
    | 'efficiency';

  // Wizard Extended Parameters
  @IsString()
  @IsOptional()
  shopName?: string;

  @IsString()
  @IsOptional()
  @IsIn(['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'])
  language?: string;

  @IsString()
  @IsOptional()
  @IsIn(['USD', 'CNY', 'JPY', 'EUR', 'GBP', 'KRW'])
  currency?: string;

  @IsString()
  @IsOptional()
  @IsIn(['minimalist', 'grid', 'magazine', 'immersive', 'split'])
  designLayout?: string;

  @IsString()
  @IsOptional()
  @IsIn(['monochromatic', 'morandi', 'contrast', 'earthy', 'pastel'])
  designPalette?: string;

  @IsString()
  @IsOptional()
  @IsIn(['high-key', 'low-key', 'warm', 'cool', 'neutral'])
  designTone?: string;

  @IsString()
  @IsOptional()
  @IsIn(['minimalist', 'classic', 'abstract', 'pop', 'organic', 'cyberpunk', 'minimal']) // 'minimal' kept for backward compat if needed, but safe to strict otherwise
  designArt?: string;

  @IsString()
  @IsOptional()
  @IsIn(['professional', 'friendly', 'humorous', 'luxury', 'confident'])
  voiceTone?: string;

  @IsString()
  @IsOptional()
  @IsIn(['short', 'medium', 'long'])
  textLength?: string;

  @IsString()
  @IsOptional()
  @IsIn(['landing', 'product', 'story', 'contact', 'blog'])
  pageType?: 'landing' | 'product' | 'story' | 'contact' | 'blog';

  @IsString()
  @IsOptional()
  @IsIn(['standard', 'blackfriday', 'christmas', 'newyear', 'summer'])
  campaignMode?:
    | 'standard'
    | 'blackfriday'
    | 'christmas'
    | 'newyear'
    | 'summer';

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsBoolean()
  @IsOptional()
  enableParallax?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(['slow', 'medium', 'fast'])
  parallaxSpeed?: string;

  @IsString()
  @IsOptional()
  @IsIn(['none', 'parallax', 'fixed', 'multilayer'])
  scrollEffect?: string;

  @IsString()
  @IsOptional()
  @IsIn(['none', 'gentle', 'moderate', 'energetic'])
  animationStyle?: string;
}
