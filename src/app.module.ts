import { Module } from '@nestjs/common';
import { ContentfulService } from './contentful/contentful.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
  controllers: [],
  providers: [ContentfulService],
})
export class AppModule {}
