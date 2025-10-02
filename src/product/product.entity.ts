import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  contentfulId: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  color: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ default: 'USD' })
  currency: string; // could be enum

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;
}
