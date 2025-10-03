import { ApiProperty } from '@nestjs/swagger';

export class PercentDeletedResponseDto {
  @ApiProperty({ description: 'Total items in the collection' })
  total: number;

  @ApiProperty({ description: 'Total deleted' })
  deleted: number;

  @ApiProperty({ description: 'Percent of deleted' })
  percent: number;
}
