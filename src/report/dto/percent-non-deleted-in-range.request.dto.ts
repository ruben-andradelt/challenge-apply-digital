import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceRangeValidator } from '../../common/validators/price-range.validator';

export class PercentNonDeletedInRangeRequestDto {
  @ApiProperty({ description: 'Start date' })
  @IsNotEmpty()
  @IsDateString()
  start: string;

  @ApiProperty({ description: 'End date' })
  @IsNotEmpty()
  @IsDateString()
  end: string;

  @ApiProperty({ description: 'Product min price', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ description: 'Product max price', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Validate(PriceRangeValidator)
  maxPrice?: number;
}
