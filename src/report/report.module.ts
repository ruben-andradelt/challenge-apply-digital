import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ProductService } from '../product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { ReportService } from './report.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ReportController],
  providers: [ReportService, ProductService, JwtService],
})
export class ReportModule {}
