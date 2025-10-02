import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async upsertFromContentful(product: ProductEntity): Promise<ProductEntity> {
    const existing = await this.productRepository.findOneBy({
      contentfulId: product.contentfulId,
    });

    if (existing) {
      existing.name = product.name;
      existing.sku = product.sku;
      existing.brand = product.brand;
      existing.model = product.model;
      existing.category = product.category;
      existing.color = product.color;
      existing.price = product.price;
      existing.currency = product.currency;
      existing.stock = product.stock;
      return this.productRepository.save(existing);
    }

    return this.productRepository.save(product);
  }
}
