import { ProductEntity } from '../product.entity';

export class ContentfulProductMapper {
  static toEntity(contentfulItem: any): ProductEntity {
    const entity = new ProductEntity();
    entity.contentfulId = contentfulItem.sys.id;
    entity.name = contentfulItem.fields.name;
    entity.sku = contentfulItem.fields.sku;
    entity.brand = contentfulItem.fields.brand;
    entity.model = contentfulItem.fields.model;
    entity.category = contentfulItem.fields.category;
    entity.color = contentfulItem.fields.color;
    entity.price = Number(contentfulItem.fields.price);
    entity.currency = contentfulItem.fields.currency;
    entity.stock = Number(contentfulItem.fields.stock);
    return entity;
  }
}
