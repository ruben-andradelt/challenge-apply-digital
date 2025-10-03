import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from './pagination.request.dto';
import { IsInt, IsOptional, IsString, Min, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { PriceRangeValidator } from '../../common/validators/price-range.validator';

export class FindProductsRequestDto extends PaginationRequestDto {
  @ApiProperty({ description: 'Product name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

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
