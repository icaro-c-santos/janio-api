import { PrismaClient } from '@prisma/client';

export enum AccountReceivableStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  OVERDUE = 'OVERDUE',
}

export interface AccountReceivableDomain {
  id: string;
  amount: number;
  status: AccountReceivableStatus;
  saleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  expectedDate: Date | null;
  metadata: any | null;
  invoiceId: string | null;
}

export interface CreateAccountReceivableData {
  amount: number;
  saleId?: string | null;
  expectedDate?: Date | null;
  metadata?: any | null;
  invoiceId?: string | null;
}

export interface IAccountReceivableRepository {
  withTransaction(tx: PrismaClient): IAccountReceivableRepository;
  create(data: CreateAccountReceivableData): Promise<AccountReceivableDomain>;
  findById(id: string): Promise<AccountReceivableDomain | null>;
}
