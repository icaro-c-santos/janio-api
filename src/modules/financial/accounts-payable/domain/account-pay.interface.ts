export enum AccountPayableStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELED = 'CANCELED',
}

export interface AccountPayDomain {
  id: string;
  description: string;
  totalValue: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentDate: Date | null;
  expenseId: string | null;
  paymentReceiptFileKey: string | null;
}

export interface IAccountPayRepository {
  findById(id: string): Promise<AccountPayDomain | null>;
}
