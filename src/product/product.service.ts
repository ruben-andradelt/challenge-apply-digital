import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Paginated } from '../common/types/paginated.type';
import { CountProductsQuery } from './types/count-products.type';
import { FindProductsQuery } from './types/find-products.type';

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async find(query: FindProductsQuery): Promise<Paginated<ProductEntity>> {
    this.logger.log(`find: ${JSON.stringify(query)}`);

    const { page = 1, rowCount = 5 } = query;

    const qb = this.productRepository.createQueryBuilder('product');

    if (query.name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.category) {
      qb.andWhere('product.category ILIKE :category', {
        category: `%${query.category}%`,
      });
    }

    if (query.minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const [items, total] = await qb
      .skip((page - 1) * rowCount)
      .take(query.rowCount)
      .getManyAndCount();

    return {
      totalItems: total,
      totalPages: Math.ceil(total / rowCount),
      page: page,
      count: items.length,
      items: items,
    };
  }

  // for testing purposes
  async findAll(): Promise<ProductEntity[]> {
    this.logger.log('findAll');

    return this.productRepository.find();
  }

  // for testing purposes
  async removeAll(): Promise<void> {
    this.logger.log('removeAll');

    await this.productRepository.clear();
  }

  async softDeleteById(id: number): Promise<void> {
    this.logger.log(`softDeleteById: ${id}`);

    await this.productRepository.softRemove({ id });
  }

  async count(query: CountProductsQuery = {}): Promise<number> {
    this.logger.log(`count: ${JSON.stringify(query)}`);

    const qb = this.productRepository.createQueryBuilder('product');

    if (query.withDeleted) {
      qb.withDeleted();
    }

    if (query.start) {
      qb.andWhere('product.createdAt >= :start', { start: query.start });
    }

    if (query.end) {
      qb.andWhere('product.createdAt <= :end', { end: query.end });
    }

    if (query.minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const total = await qb.getCount();

    return total;
  }

  async countDeleted(): Promise<number> {
    this.logger.log('countDeleted');

    return this.productRepository.count({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
  }

  async getAlmostOutOfStock(): Promise<ProductEntity[]> {
    this.logger.log('getAlmostOutOfStock');

    return this.productRepository.find({
      where: [{ stock: LessThan(10) }, { stock: IsNull() }],
    });
  }

  async upsertFromContentful(product: ProductEntity): Promise<ProductEntity> {
    this.logger.log(`upsertFromContentful: ${product.contentfulId}`);

    const existing = await this.productRepository.findOne({
      where: { contentfulId: product.contentfulId },
      withDeleted: true,
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
