import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentfulService } from './contentful/contentful.service';
import { validate } from './env.validation';
import { SchedulerService } from './scheduler/scheduler.service';
import { ProductEntity } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath: ['.env'] }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [ProductEntity],
      synchronize: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ProductModule,
    ReportModule,
    AuthModule,
  ],
  controllers: [],
  providers: [ContentfulService, SchedulerService],
})
export class AppModule {}
