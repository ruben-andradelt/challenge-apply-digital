import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Page number must be at least 1' })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 5,
    required: false,
    default: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Row count must be at least 1' })
  @Max(5, { message: 'Row count must be at most 5' })
  rowCount: number;
}
