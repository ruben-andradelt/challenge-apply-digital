import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const openApiSetup = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setDescription('Apply Digital API')
    .setTitle('Apply Digital API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
};
