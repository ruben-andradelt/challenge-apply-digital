import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductService } from '../product/product.service';
import { ContentfulProductMapper } from '../product/mappers/contetnful-product.mapper';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly productService: ProductService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchContentfulProducts() {
    try {
      console.log('fetching');
      const items = await this.contentfulService.fetchProducts();

      for await (const item of items) {
        await this.productService.upsertFromContentful(
          ContentfulProductMapper.toEntity(item),
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
}
