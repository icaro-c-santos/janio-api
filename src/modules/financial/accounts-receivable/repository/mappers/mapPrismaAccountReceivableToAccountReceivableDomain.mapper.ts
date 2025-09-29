import { AccountReceivable as AccountReceivableEntity } from '@prisma/client';
import { AccountReceivableDomain } from '../../domain/account-receivable.interface';

export class AccountReceivableRepositoryMap {
  public static mapPrismaAccountReceivableToAccountReceivableDomain(
    accountReceivableEntity: AccountReceivableEntity,
  ): AccountReceivableDomain {
    return {
      id: accountReceivableEntity.id,
      amount: Number(accountReceivableEntity.amount),
      status: accountReceivableEntity.status as any,
      saleId: accountReceivableEntity?.saleId || null,
      createdAt: accountReceivableEntity.createdAt,
      updatedAt: accountReceivableEntity.updatedAt,
      expectedDate: accountReceivableEntity.expectedDate,
      metadata: accountReceivableEntity.metadata as any,
      invoiceId: accountReceivableEntity.invoiceId,
    };
  }
}
