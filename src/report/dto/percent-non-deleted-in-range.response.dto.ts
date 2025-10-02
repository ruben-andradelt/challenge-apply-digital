import { ApiProperty } from '@nestjs/swagger';

export class PercentNonDeletedInRangeResponseDto {
  @ApiProperty({ description: 'Total items in the collection' })
  total: number;

  @ApiProperty({ description: 'Total non deleted in range' })
  nonDeletedInRange: number;

  @ApiProperty({ description: 'Percent of non deleted in range' })
  percent: number;
}
