import { CreateSaleResponse } from '../../aplication/usecases/sale/types';
import { createCustomerMock } from './customer.mock';
import { faker } from './faker';
import { createProductMock } from './product.mock';

export function createSaleMock(
  options?: Partial<CreateSaleResponse>,
): CreateSaleResponse {
  return {
    id: options?.id ?? faker.string.uuid(),
    productId: options?.productId ?? faker.string.uuid(),
    customerId: options?.customerId ?? faker.string.uuid(),
    quantity: options?.quantity ?? faker.number.int({ min: 1, max: 100 }),
    unitPrice: options?.unitPrice ?? faker.number.int({ min: 10, max: 1000 }),
    totalPrice:
      options?.totalPrice ?? faker.number.int({ min: 10, max: 10000 }),
    saleDate: options?.saleDate ?? faker.date.birthdate(),
    receiptFileUrl:
      options?.receiptFileUrl !== undefined
        ? options.receiptFileUrl
        : faker.string.uuid(),
    customer: createCustomerMock(),
    product: createProductMock(),
    receiptFileKey: options?.receiptFileKey ?? null,
  };
}
