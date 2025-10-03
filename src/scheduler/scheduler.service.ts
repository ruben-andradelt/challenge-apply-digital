import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductService } from '../product/product.service';
import { ContentfulProductMapper } from '../product/mappers/contetnful-product.mapper';

@Injectable()
export class SchedulerService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly productService: ProductService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchContentfulProducts(): Promise<void> {
    try {
      this.logger.log('fetchContentfulProducts');

      let page = 1;
      while (true) {
        this.logger.log(`fetching page ${page}`);
        const { currentPage, pages } =
          await this.pullContentfulProductsByPage(page);

        page += 1;

        if (currentPage >= pages) break;
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async pullContentfulProductsByPage(
    page: number = 1,
  ): Promise<Record<'pages' | 'currentPage', number>> {
    const { items, pages, currentPage } =
      await this.contentfulService.fetchProducts(page);

    for await (const item of items) {
      await this.productService.upsertFromContentful(
        ContentfulProductMapper.toEntity(item),
      );
    }

    return { pages, currentPage };
  }
}
