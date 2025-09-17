import { ProductDomain } from '../../domain/interfaces/product.interface';
import { faker } from './faker';

export function createProductMock(
  options?: Partial<ProductDomain>,
): ProductDomain {
  return {
    id: options?.id ?? faker.string.uuid(),
    name: options?.name ?? faker.company.name(),
    description: options?.description ?? faker.person.fullName(),
    price: options?.price ?? faker.number.int({ min: 10, max: 1000 }),
    createdAt: options?.createdAt ?? faker.date.birthdate(),
    updatedAt: options?.updatedAt ?? faker.date.birthdate(),
    deletedAt: options?.deletedAt ?? null,
  };
}
