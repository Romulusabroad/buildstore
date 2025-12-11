import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Post()
  create(@Body() createNavDto: any) {
    return this.navigationService.create(createNavDto);
  }

  @Get()
  findAll(@Query('siteId') siteId: string) {
    return this.navigationService.findAllBySite(siteId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNavDto: any) {
    return this.navigationService.update(id, updateNavDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigationService.remove(id);
  }
}
