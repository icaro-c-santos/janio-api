import { AccountReceivableDomain } from '../../domain/account-receivable.interface';
import { CreateAccountReceivableResponse } from '../types';

export class AccountReceivableMapResponse {
  public static mapAccountReceivableToResponse(
    accountReceivable: AccountReceivableDomain,
  ): CreateAccountReceivableResponse {
    return {
      id: accountReceivable.id,
      amount: accountReceivable.amount,
      status: accountReceivable.status,
      saleId: accountReceivable.saleId,
      createdAt: accountReceivable.createdAt,
      updatedAt: accountReceivable.updatedAt,
      expectedDate: accountReceivable.expectedDate,
      metadata: accountReceivable.metadata,
      invoiceId: accountReceivable.invoiceId,
    };
  }
}
