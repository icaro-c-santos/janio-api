import {
  Product as ProductEntity,
  Sale as SaleEntity,
  Customer as CustomerEntity,
  User as UserEntity,
  Individual as IndividualEntity,
  Company as CompanyEntity,
  Phone as PhoneEntity,
  Address as AddressEntity,
} from '@prisma/client';
import { SaleDomain } from '../../../../domain/interfaces/sales.interface';
import { UserRepositoryMap } from '../../shared/mappers/mapPrismaUserToUser.mapper';

export class SaleRepositoryMap {
  public static mapPrismaSaleToSale(
    saleEntity: SaleEntity & {
      product: ProductEntity;
      customer: CustomerEntity & {
        user: UserEntity & {
          individual: IndividualEntity;
          company: CompanyEntity;
          phones: PhoneEntity[];
          addresses: AddressEntity[];
        };
      };
    },
  ): SaleDomain {
    return {
      id: saleEntity.id,
      productId: saleEntity.productId,
      customerId: saleEntity.customerId,
      quantity: saleEntity.quantity,
      unitPrice: Number(saleEntity.unitPrice),
      totalPrice: Number(saleEntity.totalPrice),
      saleDate: saleEntity.saleDate,
      receiptFileKey: saleEntity.receiptFileKey,
      product: {
        id: saleEntity.product.id,
        name: saleEntity.product.name,
        description: saleEntity.product.description,
        price: saleEntity.product.price
          ? Number(saleEntity.product.price)
          : undefined,
      },
      customer: {
        userId: saleEntity.customer.userId,
        user: UserRepositoryMap.mapPrismaUserToUser(saleEntity.customer.user),
      },
    };
  }
}
