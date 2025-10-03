import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ProductService } from '../product/product.service';
import { roundToTwoDecimals } from '../utils/number';

describe('ReportService', () => {
  let service: ReportService;
  let productService: ProductService;

  const mockProductService = {
    count: jest.fn(),
    countDeleted: jest.fn(),
    getAlmostOutOfStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('percentDeleted', () => {
    it('should calculate percent deleted correctly', async () => {
      mockProductService.count.mockResolvedValue(10);
      mockProductService.countDeleted.mockResolvedValue(4);

      const result = await service.percentDeleted();

      expect(productService.count).toHaveBeenCalledWith({ withDeleted: true });
      expect(productService.countDeleted).toHaveBeenCalled();
      expect(result).toEqual({
        total: 10,
        deleted: 4,
        percent: roundToTwoDecimals((4 / 10) * 100),
      });
    });

    it('should handle total = 0', async () => {
      mockProductService.count.mockResolvedValue(0);
      mockProductService.countDeleted.mockResolvedValue(0);

      const result = await service.percentDeleted();

      expect(result.percent).toBe(0);
    });
  });

  describe('percentNonDeletedWithPrice', () => {
    it('should calculate non-deleted in price range correctly', async () => {
      const query = {
        start: '2025-01-01',
        end: '2025-01-31',
        minPrice: 10,
        maxPrice: 100,
      };
      mockProductService.count.mockResolvedValue(20);
      mockProductService.count
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(5);

      mockProductService.count.mockImplementation(({ withDeleted }) =>
        Promise.resolve(withDeleted ? 20 : 5),
      );

      const result = await service.percentNonDeletedWithPrice(query);

      expect(productService.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        total: 20,
        nonDeletedInRange: 5,
        percent: roundToTwoDecimals((5 / 20) * 100),
      });
    });

    it('should handle total = 0', async () => {
      const query = {
        start: '2025-01-01',
        end: '2025-01-31',
        minPrice: 10,
        maxPrice: 100,
      };
      mockProductService.count.mockResolvedValue(0);

      const result = await service.percentNonDeletedWithPrice(query);

      expect(result.percent).toBe(0);
    });
  });

  describe('almostOutOfStock', () => {
    it('should return formatted product strings', async () => {
      mockProductService.getAlmostOutOfStock.mockResolvedValue([
        { id: 1, name: 'Product 1', stock: 2 },
        { id: 2, name: 'Product 2', stock: 1 },
      ]);

      const result = await service.almostOutOfStock();

      expect(productService.getAlmostOutOfStock).toHaveBeenCalled();
      expect(result).toEqual([
        'Product 1 (ID: 1) - Stock: 2',
        'Product 2 (ID: 2) - Stock: 1',
      ]);
    });

    it('should return empty array if no products', async () => {
      mockProductService.getAlmostOutOfStock.mockResolvedValue([]);

      const result = await service.almostOutOfStock();
      expect(result).toEqual([]);
    });
  });
});
