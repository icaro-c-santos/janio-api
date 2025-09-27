import { AccountPayDomain } from '../../domain/account-pay.interface';
import { GetAccountPayByIdResponse } from '../types';

export class AccountPayMapResponse {
  public static mapAccountPayToResponse(
    accountPay: AccountPayDomain,
  ): GetAccountPayByIdResponse {
    return {
      id: accountPay.id,
      description: accountPay.description,
      totalValue: accountPay.totalValue,
      dueDate: accountPay.dueDate,
      createdAt: accountPay.createdAt,
      updatedAt: accountPay.updatedAt,
      paymentDate: accountPay.paymentDate,
      expenseId: accountPay.expenseId,
      paymentReceiptFileKey: accountPay.paymentReceiptFileKey,
    };
  }
}
