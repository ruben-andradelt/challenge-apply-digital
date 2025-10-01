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

  async fetchProducts() {
    const entries = await this.client.getEntries({
      content_type: this.configService.get('CONTENTFUL_CONTENT_TYPE')!,
      limit: 100,
    });

    return entries.items;
  }
}
