export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  getProductPriceByCustomerId(props: {
    customerId: string;
    productId: string;
  }): Promise<number | null>;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
