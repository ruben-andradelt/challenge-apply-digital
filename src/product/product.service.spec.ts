import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Not, IsNull, LessThan } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<Repository<ProductEntity>>;

  const mockRepo = {
    find: jest.fn(),
    clear: jest.fn(),
    softRemove: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(ProductEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(getRepositoryToken(ProductEntity));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    let mockQB: any;

    beforeEach(() => {
      mockQB = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      };

      repository.createQueryBuilder.mockReturnValue(mockQB);
    });

    it('should return paginated results with default page and rowCount', async () => {
      const items = [{ id: 6 }, { id: 7 }];
      mockQB.getManyAndCount.mockResolvedValue([items, 7]);

      const result = await service.find({});

      expect(mockQB.skip).toHaveBeenCalledWith(0);
      expect(mockQB.take).toHaveBeenCalledWith(undefined);

      expect(result).toEqual({
        totalItems: 7,
        totalPages: 2,
        page: 1,
        count: items.length,
        items,
      });
    });

    it('should apply filters when provided', async () => {
      const items = [{ id: 1 }];
      mockQB.getManyAndCount.mockResolvedValue([items, 1]);

      const query = {
        page: 2,
        rowCount: 5,
        name: 'foo',
        category: 'bar',
        minPrice: 10,
        maxPrice: 100,
      };

      const result = await service.find(query);

      expect(mockQB.andWhere).toHaveBeenCalledWith('product.name ILIKE :name', {
        name: '%foo%',
      });
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'product.category ILIKE :category',
        { category: '%bar%' },
      );
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'product.price >= :minPrice',
        { minPrice: 10 },
      );
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'product.price <= :maxPrice',
        { maxPrice: 100 },
      );
      expect(mockQB.skip).toHaveBeenCalledWith(5);
      expect(mockQB.take).toHaveBeenCalledWith(5);
      expect(result.totalItems).toBe(1);
    });

    it('should handle empty results', async () => {
      mockQB.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.find({ page: 1, rowCount: 5 });

      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1 } as any];
      repository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('removeAll', () => {
    it('should clear the repository', async () => {
      await service.removeAll();
      expect(repository.clear).toHaveBeenCalled();
    });
  });

  describe('softDeleteById', () => {
    it('should soft remove the product by id', async () => {
      await service.softDeleteById(1);
      expect(repository.softRemove).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('count', () => {
    it('should return count from query builder', async () => {
      const mockQB = {
        withDeleted: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQB);

      const result = await service.count({ withDeleted: true });
      expect(mockQB.withDeleted).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('countDeleted', () => {
    it('should count deleted products', async () => {
      repository.count.mockResolvedValue(3);
      const result = await service.countDeleted();

      expect(repository.count).toHaveBeenCalledWith({
        withDeleted: true,
        where: { deletedAt: Not(IsNull()) },
      });
      expect(result).toBe(3);
    });
  });

  describe('getAlmostOutOfStock', () => {
    it('should return products with stock < 10 or null', async () => {
      const products = [{ id: 1 } as any];
      repository.find.mockResolvedValue(products);

      const result = await service.getAlmostOutOfStock();
      expect(repository.find).toHaveBeenCalledWith({
        where: [{ stock: LessThan(10) }, { stock: IsNull() }],
      });
      expect(result).toEqual(products);
    });
  });

  describe('upsertFromContentful', () => {
    it('should update existing product if found', async () => {
      const product = { contentfulId: 'abc', name: 'P1' } as any;
      const existing = { contentfulId: 'abc', name: 'Old' } as any;

      repository.findOne.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, name: 'P1' });

      const result = await service.upsertFromContentful(product);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { contentfulId: 'abc' },
        withDeleted: true,
      });
      expect(repository.save).toHaveBeenCalledWith({ ...existing, name: 'P1' });
      expect(result.name).toBe('P1');
    });

    it('should insert new product if not found', async () => {
      const product = { contentfulId: 'xyz', name: 'New' } as any;
      repository.findOne.mockResolvedValue(null);
      repository.save.mockResolvedValue(product);

      const result = await service.upsertFromContentful(product);

      expect(repository.save).toHaveBeenCalledWith(product);
      expect(result).toBe(product);
    });
  });
});
