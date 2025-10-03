import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ConfigService } from '@nestjs/config';
import * as contentful from 'contentful';

jest.mock('contentful');

describe('ContentfulService', () => {
  let service: ContentfulService;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = { getEntries: jest.fn() };
    (contentful.createClient as jest.Mock).mockReturnValue(mockClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values = {
                CONTENTFUL_SPACE_ID: 'space-id',
                CONTENTFUL_ACCESS_TOKEN: 'access-token',
                CONTENTFUL_ENVIRONMENT: 'master',
                CONTENTFUL_CONTENT_TYPE: 'product',
              };
              return values[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch products and return paginated result', async () => {
    const mockEntries = {
      items: [{ sys: { id: '1' }, fields: { name: 'Product 1' } }],
      total: 1,
    };
    mockClient.getEntries.mockResolvedValue(mockEntries);

    const result = await service.fetchProducts(1, 25);

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'product',
      limit: 25,
      skip: 0,
    });

    expect(result).toEqual({
      items: mockEntries.items,
      total: mockEntries.total,
      pages: 1,
      currentPage: 1,
    });
  });

  it('should calculate skip correctly for page > 1', async () => {
    const mockEntries = {
      items: [],
      total: 50,
    };
    mockClient.getEntries.mockResolvedValue(mockEntries);

    const result = await service.fetchProducts(2, 10);

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'product',
      limit: 10,
      skip: 10,
    });

    expect(result.pages).toBe(5);
    expect(result.currentPage).toBe(2);
  });
});
