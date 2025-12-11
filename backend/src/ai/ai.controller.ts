import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateSiteDto } from './dto/generate-site.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  async generateSite(@Body() dto: GenerateSiteDto) {
    return this.aiService.generateSite(dto.prompt, dto.style, dto.sections, {
      industry: dto.industry,
      productName: dto.productName,
      productDescription: dto.productDescription,
      targetAudience: dto.targetAudience,
      competitiveStrategy: dto.competitiveStrategy,
      // Wizard Extended Parameters
      shopName: dto.shopName,
      language: dto.language,
      currency: dto.currency,

      pageType: dto.pageType,
      campaignMode: dto.campaignMode,
      primaryColor: dto.primaryColor,
      // New Dimensions
      designLayout: dto.designLayout as any,
      designPalette: dto.designPalette as any,
      designTone: dto.designTone as any,
      designArt: dto.designArt as any,
    });
  }
}
