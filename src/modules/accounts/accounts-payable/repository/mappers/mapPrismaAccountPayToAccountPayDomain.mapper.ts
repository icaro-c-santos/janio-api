import { AccountPayable as AccountPayableEntity } from '@prisma/client';
import { AccountPayDomain } from '../../domain/account-pay.interface';

export class AccountPayableRepositoryMap {
  public static mapPrismaCustomerToCustomer(
    accountPayableEntity: AccountPayableEntity,
  ): AccountPayDomain {
    return {
      id: accountPayableEntity.id,
      createdAt: accountPayableEntity.createdAt,
      description: accountPayableEntity.description,
      dueDate: accountPayableEntity.dueDate,
      expenseId: accountPayableEntity.expenseId,
      paymentDate: accountPayableEntity.paymentDate || null,
      paymentReceiptFileKey: accountPayableEntity.paymentReceiptFileKey || null,
      totalValue: Number(accountPayableEntity?.totalValue),
      updatedAt: accountPayableEntity.updatedAt,
    };
  }
}
