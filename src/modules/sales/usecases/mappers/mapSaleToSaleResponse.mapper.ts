import { SaleDomain } from '../../domain/sales.interface';

export class SaleMapResponse {
  public static mapSaleToResponse(
    sale: SaleDomain & { receiptFileUrl?: string | null },
  ) {
    return {
      id: sale.id,
      productId: sale.productId,
      customerId: sale.customerId,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      totalPrice: sale.totalPrice,
      saleDate: sale.saleDate,
      receiptFileKey: sale.receiptFileKey || null,
      ...(sale.receiptFileUrl && { receiptFileUrl: sale.receiptFileUrl }),
      product: {
        id: sale.product.id,
        name: sale.product.name,
        description: sale.product.description,
        price: sale.product.price,
      },

      customer: {
        userId: sale.customer.userId,
        user: {
          id: sale.customer.user.id,
          type: sale.customer.user.type,
          email: sale.customer.user.email,

          individual: sale.customer.user.individual
            ? {
                cpf: sale.customer.user.individual.cpf,
                fullName: sale.customer.user.individual.fullName,
                birthDate: sale.customer.user.individual.birthDate,
              }
            : undefined,

          company: sale.customer.user.company
            ? {
                cnpj: sale.customer.user.company.cnpj,
                legalName: sale.customer.user.company.legalName,
                tradeName: sale.customer.user.company.tradeName,
                stateRegistration: sale.customer.user.company.stateRegistration,
              }
            : undefined,
        },
      },
    };
  }
}
