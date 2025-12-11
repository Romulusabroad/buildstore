import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto, UpdateSiteDto } from './dto/site.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';

@Controller('sites')
// @UseGuards(SupabaseAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto, @Request() req) {
    // Mock user ID for testing (Must be valid UUID for Supabase)
    const userId = req.user?.id || 'af8d7d1d-6427-402c-a3aa-c762b393a6a9';
    return this.sitesService.create(createSiteDto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user?.id || 'af8d7d1d-6427-402c-a3aa-c762b393a6a9';
    return this.sitesService.findAll(userId);
  }

  @Get('by-domain')
  findByDomain(@Query('domain') domain: string) {
    return this.sitesService.findByDomain(domain);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }
}
