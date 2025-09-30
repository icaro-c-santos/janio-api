export interface IProductRepository {
  findById(id: string): Promise<ProductDomain | null>;
  findAll(): Promise<ProductDomain[]>;
  getProductPriceByCustomerId(props: {
    customerId: string;
    productId: string;
  }): Promise<number | null>;
}

export interface ProductDomain {
  id: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
