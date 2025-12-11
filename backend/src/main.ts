import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 0. Increase Payload Limit (Fix 413 Error)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 1. Enable CORS (Allow Frontend to talk to Backend)
  app.enableCors();

  // 2. Enable Global Validation (Ensure data is correct)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // properties not in DTO are stripped
      forbidNonWhitelisted: true, // throw error if extra properties are sent
    }),
  );

  // 3. Setup Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Site Builder API')
    .setDescription('The backend API for your Independent Site Builder')
    .setVersion('1.0')
    .addBearerAuth() // Allow inputting token in Swagger UI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
