import { Injectable } from '@nestjs/common';
import * as contentful from 'contentful';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentfulService {
  private client: contentful.ContentfulClientApi<undefined>;

  constructor(private readonly configService: ConfigService) {
    this.client = contentful.createClient({
      space: this.configService.get('CONTENTFUL_SPACE_ID')!,
      accessToken: this.configService.get('CONTENTFUL_ACCESS_TOKEN')!,
      environment: this.configService.get('CONTENTFUL_ENVIRONMENT')!,
    });
  }

  async fetchProducts(page: number = 1, limit: number = 25) {
    const skip = (page - 1) * limit;

    const entries = await this.client.getEntries({
      content_type: this.configService.get('CONTENTFUL_CONTENT_TYPE')!,
      limit,
      skip,
    });

    return {
      items: entries.items,
      total: entries.total,
      pages: Math.ceil(entries.total / limit),
      currentPage: page,
    };
  }
}
