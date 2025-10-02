import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { roundToTwoDecimals } from '../utils/number';

@Injectable()
export class ReportService {
  constructor(private productService: ProductService) {}

  async percentDeleted(): Promise<any> {
    const total = await this.productService.count({ withDeleted: true });
    const deleted = await this.productService.countDeleted();
    const percent = total === 0 ? 0 : (deleted / total) * 100;

    return { total, deleted, percent: roundToTwoDecimals(percent) };
  }

  async percentNonDeletedWithPrice(query: any): Promise<any> {
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
    const almostOutOfStock = await this.productService.getAlmostOutOfStock();

    return almostOutOfStock.map(
      (product) =>
        `${product.name} (ID: ${product.id}) - Stock: ${product.stock}`,
    );
  }
}
