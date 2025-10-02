import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { PercentNonDeletedInRangeRequestDto } from './dto/percent-non-deleted-in-range.request.dto';
import { PercentNonDeletedInRangeResponseDto } from './dto/percent-non-deleted-in-range.response.dto';
import { PercentDeletedResponseDto } from './dto/percent-deleted.response.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('percent-deleted')
  @ApiOkResponse({ type: PercentDeletedResponseDto })
  async percentDeleted(): Promise<PercentDeletedResponseDto> {
    return this.reportService.percentDeleted();
  }

  @Get('percent-non-deleted-with-price')
  @ApiOkResponse({ type: PercentNonDeletedInRangeResponseDto })
  async percentNonDeletedWithPrice(
    @Query() query: PercentNonDeletedInRangeRequestDto,
  ): Promise<PercentNonDeletedInRangeResponseDto> {
    return this.reportService.percentNonDeletedWithPrice(query);
  }

  @Get('almost-out-of-stock')
  @ApiOkResponse({ type: PercentNonDeletedInRangeResponseDto })
  async almostOutOfStock(): Promise<string[]> {
    return this.reportService.almostOutOfStock();
  }
}
