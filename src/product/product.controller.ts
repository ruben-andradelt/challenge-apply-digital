import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductMv } from './mv/product.mv';
import { FindProductsRequestDto } from './dto/find-products.request.dto';
import { FindProductsResponseDto } from './dto/find-products.response.dto';

@ApiTags('Public')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  @ApiOperation({
    summary: '⚠️ Test-only endpoint',
    description: 'Get all products',
  })
  @ApiOkResponse()
  async findAll(): Promise<ProductMv[]> {
    return this.productService.findAll();
  }

  @Get()
  @ApiOkResponse({ type: FindProductsResponseDto })
  @ApiBadRequestResponse()
  async find(
    @Query() query: FindProductsRequestDto,
  ): Promise<FindProductsResponseDto> {
    return this.productService.find(query);
  }

  @Delete('all')
  @ApiOperation({
    summary: '⚠️ Test-only endpoint',
    description: 'Delete all products',
  })
  @ApiOkResponse()
  async deleteAll(): Promise<void> {
    return this.productService.removeAll();
  }

  @Delete(':id')
  @ApiOkResponse()
  async softDeleteById(@Param('id') id: string): Promise<void> {
    return this.productService.softDeleteById(Number(id));
  }
}
