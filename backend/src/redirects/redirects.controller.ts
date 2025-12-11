import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { RedirectsService } from './redirects.service';

@Controller('redirects')
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  @Post()
  create(@Body() createRedirectDto: any) {
    return this.redirectsService.create(createRedirectDto);
  }

  @Get()
  findAll(@Query('siteId') siteId: string) {
    return this.redirectsService.findAllBySite(siteId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redirectsService.remove(id);
  }
}
