export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
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
