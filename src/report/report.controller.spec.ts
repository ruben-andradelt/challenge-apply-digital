import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PercentDeletedResponse } from './types/percent-deleted.type';
import {
  PercentNonDeletedInRangeQuery,
  PercentNonDeletedInRangeResponse,
} from './types/percent-non-deleted-in-nrage.type';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  const mockReportService = {
    percentDeleted: jest.fn(),
    percentNonDeletedWithPrice: jest.fn(),
    almostOutOfStock: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockJwtGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        { provide: ReportService, useValue: mockReportService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: APP_GUARD,
          useValue: mockJwtGuard,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('percentDeleted', () => {
    it('should return percentDeleted result from service', async () => {
      const mockResult: PercentDeletedResponse = {
        total: 10,
        deleted: 4,
        percent: 40,
      };
      mockReportService.percentDeleted.mockResolvedValue(mockResult);

      const result = await controller.percentDeleted();

      expect(result).toEqual(mockResult);
      expect(service.percentDeleted).toHaveBeenCalled();
    });
  });

  describe('percentNonDeletedWithPrice', () => {
    it('should return non-deleted in range result from service', async () => {
      const query: PercentNonDeletedInRangeQuery = {
        start: '2025-01-01',
        end: '2025-01-31',
        minPrice: 10,
        maxPrice: 100,
      };

      const mockResult: PercentNonDeletedInRangeResponse = {
        total: 20,
        nonDeletedInRange: 5,
        percent: 25,
      };

      mockReportService.percentNonDeletedWithPrice.mockResolvedValue(
        mockResult,
      );

      const result = await controller.percentNonDeletedWithPrice(query);

      expect(result).toEqual(mockResult);
      expect(service.percentNonDeletedWithPrice).toHaveBeenCalledWith(query);
    });
  });

  describe('almostOutOfStock', () => {
    it('should return formatted product strings from service', async () => {
      const mockResult = [
        'Product 1 (ID: 1) - Stock: 2',
        'Product 2 (ID: 2) - Stock: 1',
      ];
      mockReportService.almostOutOfStock.mockResolvedValue(mockResult);

      const result = await controller.almostOutOfStock();

      expect(result).toEqual(mockResult);
      expect(service.almostOutOfStock).toHaveBeenCalled();
    });
  });
});
