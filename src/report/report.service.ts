import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { roundToTwoDecimals } from '../utils/number';
import { PercentDeletedResponse } from './types/percent-deleted.type';
import {
  PercentNonDeletedInRangeQuery,
  PercentNonDeletedInRangeResponse,
} from './types/percent-non-deleted-in-nrage.type';

@Injectable()
export class ReportService {
  private logger = new Logger(this.constructor.name);

  constructor(private productService: ProductService) {}

  async percentDeleted(): Promise<PercentDeletedResponse> {
    this.logger.log('percentDeleted');

    const total = await this.productService.count({ withDeleted: true });
    const deleted = await this.productService.countDeleted();
    const percent = total === 0 ? 0 : (deleted / total) * 100;

    return { total, deleted, percent: roundToTwoDecimals(percent) };
  }

  async percentNonDeletedWithPrice(
    query: PercentNonDeletedInRangeQuery,
  ): Promise<PercentNonDeletedInRangeResponse> {
    this.logger.log(`percentNonDeletedWithPrice: ${JSON.stringify(query)}`);

    const start = new Date(query.start);
    const end = new Date(query.end);
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;

    const total = await this.productService.count({ withDeleted: true });
    const nonDeletedInRange = await this.productService.count({
      withDeleted: false,
      start,
      end,
      minPrice,
      maxPrice,
    });

    const percent = total === 0 ? 0 : (nonDeletedInRange / total) * 100;

    return {
      total,
      nonDeletedInRange,
      percent: roundToTwoDecimals(percent),
    };
  }

  async almostOutOfStock(): Promise<string[]> {
    this.logger.log('almostOutOfStock');

    const almostOutOfStock = await this.productService.getAlmostOutOfStock();

    return almostOutOfStock.map(
      (product) =>
        `${product.name} (ID: ${product.id}) - Stock: ${product.stock}`,
    );
  }
}
