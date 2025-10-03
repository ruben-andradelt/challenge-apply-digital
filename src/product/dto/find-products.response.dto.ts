import { ProductMv } from '../mv/product.mv';
import { PaginatedResponseDto } from './paginated.response.dto';

export class FindProductsResponseDto extends PaginatedResponseDto<ProductMv> {}
