import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // TODO: obviously this would be a build step.
  writeFileSync(
    'dist/swagger.json',
    JSON.stringify(document, null, ' '),
    'utf-8',
  );

  await app.listen(3000);
}

bootstrap();
