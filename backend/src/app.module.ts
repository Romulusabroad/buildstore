import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { SitesModule } from './sites/sites.module';
import { PagesModule } from './pages/pages.module';
import { AiModule } from './ai/ai.module';
import { RedirectsModule } from './redirects/redirects.module';
import { NavigationModule } from './navigation/navigation.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    SitesModule,
    PagesModule,
    AiModule,
    RedirectsModule,
    NavigationModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
