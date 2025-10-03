import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    find: jest.fn(),
    findAll: jest.fn(),
    removeAll: jest.fn(),
    softDeleteById: jest.fn(),
    count: jest.fn(),
    countDeleted: jest.fn(),
    getAlmostOutOfStock: jest.fn(),
    upsertFromContentful: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findAll', async () => {
    mockProductService.findAll.mockResolvedValue(['product1']);
    const result = await controller.findAll();
    expect(result).toEqual(['product1']);
    expect(mockProductService.findAll).toHaveBeenCalled();
  });
});
