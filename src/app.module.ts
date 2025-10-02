import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentfulService } from './contentful/contentful.service';
import { validate } from './env.validation';
import { SchedulerService } from './scheduler/scheduler.service';
import { ProductEntity } from './product/product.entity';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [ProductEntity],
      synchronize: true,
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [ContentfulService, SchedulerService],
})
export class AppModule {}
