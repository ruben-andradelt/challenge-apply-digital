import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { FindProductsRequestDto } from './dto/find-products.request.dto';
import { FindProductsResponseDto } from './dto/find-products.response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async find(query: FindProductsRequestDto): Promise<FindProductsResponseDto> {
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
      .skip((query.page - 1) * query.rowCount)
      .take(query.rowCount)
      .getManyAndCount();

    return {
      totalItems: total,
      totalPages: Math.ceil(total / query.rowCount),
      page: query.page,
      count: items.length,
      items: items,
    };
  }

  // for testing purposes
  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  // for testing purposes
  async removeAll(): Promise<void> {
    await this.productRepository.clear();
  }

  async softDeleteById(id: number): Promise<void> {
    await this.productRepository.softRemove({ id });
  }

  async count(query: any = {}): Promise<number> {
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
    return this.productRepository.count({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
  }

  async getAlmostOutOfStock(): Promise<ProductEntity[]> {
    return this.productRepository.find({
      where: [{ stock: LessThan(10) }, { stock: IsNull() }],
    });
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
