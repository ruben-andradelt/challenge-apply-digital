import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulService } from './contentful/contentful.service';
import { validate } from './env.validation';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [ContentfulService, SchedulerService],
})
export class AppModule {}
