import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulService } from '../contentful/contentful.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly contentfulService: ContentfulService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchContentfulProducts() {
    try {
      // await this.contentfulService.fetchProducts();
      // do something
    } catch (err) {
      console.log(err);
    }
  }
}
