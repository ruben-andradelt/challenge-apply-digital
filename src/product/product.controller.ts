import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductMv } from './mv/product.mv';
import { PaginatedResponseDto } from './dto/paginated.response.dto';
import { FindProductsRequestDto } from './dto/find-products.request.dto';
import { FindProductsResponseDto } from './dto/find-products.response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async findAll(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto<ProductMv> })
  @ApiBadRequestResponse()
  async find(
    @Query() query: FindProductsRequestDto,
  ): Promise<FindProductsResponseDto> {
    return this.productService.find(query);
  }

  @Delete()
  async deleteAll(): Promise<void> {
    return this.productService.removeAll();
  }
}
