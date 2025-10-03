import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductService } from '../product/product.service';
import { ContentfulProductMapper } from '../product/mappers/contetnful-product.mapper';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const mockContentfulService = {
    fetchProducts: jest.fn(),
  };

  const mockProductService = {
    upsertFromContentful: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: ContentfulService, useValue: mockContentfulService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);

    jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pullContentfulProductsByPage', () => {
    it('should upsert all fetched products', async () => {
      const items = [
        { sys: { id: '1' }, fields: { name: 'Product 1' } },
        { sys: { id: '2' }, fields: { name: 'Product 2' } },
      ];
      mockContentfulService.fetchProducts.mockResolvedValue({
        items,
        pages: 1,
        currentPage: 1,
      });

      const result = await (service as any).pullContentfulProductsByPage(1);

      expect(mockContentfulService.fetchProducts).toHaveBeenCalledWith(1);
      expect(mockProductService.upsertFromContentful).toHaveBeenCalledTimes(
        items.length,
      );

      items.forEach((item) => {
        expect(mockProductService.upsertFromContentful).toHaveBeenCalledWith(
          ContentfulProductMapper.toEntity(item),
        );
      });

      expect(result).toEqual({ pages: 1, currentPage: 1 });
    });
  });

  describe('fetchContentfulProducts', () => {
    it('should fetch all pages and upsert products', async () => {
      mockContentfulService.fetchProducts
        .mockResolvedValueOnce({
          items: [
            {
              sys: { id: '1' },
              fields: {
                name: 'Product 1',
                sku: 'SKU1',
                brand: 'Brand1',
                model: 'Model1',
                category: 'Cat1',
                color: 'Red',
                price: '100',
                currency: 'USD',
                stock: '10',
              },
            },
          ],
          pages: 2,
          currentPage: 1,
        })
        .mockResolvedValueOnce({
          items: [
            {
              sys: { id: '2' },
              fields: {
                name: 'Product 2',
                sku: 'SKU2',
                brand: 'Brand2',
                model: 'Model2',
                category: 'Cat2',
                color: 'Blue',
                price: '200',
                currency: 'USD',
                stock: '5',
              },
            },
          ],
          pages: 2,
          currentPage: 2,
        });

      await service.fetchContentfulProducts();

      expect(mockContentfulService.fetchProducts).toHaveBeenCalledTimes(2);
      expect(mockProductService.upsertFromContentful).toHaveBeenCalledTimes(2);
    });

    it('should catch errors and log them', async () => {
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
      mockContentfulService.fetchProducts.mockRejectedValue(new Error('fail'));

      await service.fetchContentfulProducts();

      expect(loggerErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
