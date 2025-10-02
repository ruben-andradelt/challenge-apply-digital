import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from './pagination.request.dto';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'PriceRange', async: false })
export class PriceRangeValidator implements ValidatorConstraintInterface {
  validate(maxPrice: number, args: ValidationArguments) {
    const dto = args.object as FindProductsRequestDto;
    if (dto.minPrice != null && maxPrice != null) {
      return maxPrice >= dto.minPrice;
    }

    return true;
  }

  defaultMessage() {
    return 'Max price must be greater than or equal than minPrice';
  }
}

export class FindProductsRequestDto extends PaginationRequestDto {
  @ApiProperty({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product category' })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Product min price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice: number;

  @ApiProperty({ description: 'Product max price' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Validate(PriceRangeValidator)
  maxPrice: number;
}
