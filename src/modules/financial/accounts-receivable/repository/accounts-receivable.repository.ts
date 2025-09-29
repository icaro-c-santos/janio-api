import { PrismaClient } from '@prisma/client';
import {
  AccountReceivableDomain,
  CreateAccountReceivableData,
  IAccountReceivableRepository,
} from '../domain/account-receivable.interface';
import { AccountReceivableRepositoryMap } from './mappers/mapPrismaAccountReceivableToAccountReceivableDomain.mapper';

export class AccountReceivableRepository
  implements IAccountReceivableRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  withTransaction(tx: PrismaClient): IAccountReceivableRepository {
    return new AccountReceivableRepository(tx);
  }

  async create(
    data: CreateAccountReceivableData,
  ): Promise<AccountReceivableDomain> {
    const accountReceivable = await this.prisma.accountReceivable.create({
      data: {
        amount: data.amount,
        status: 'PENDING',
        saleId: data.saleId || undefined,
        expectedDate: data.expectedDate || undefined,
        metadata: data.metadata || undefined,
        invoiceId: data.invoiceId!,
      },
    });

    return AccountReceivableRepositoryMap.mapPrismaAccountReceivableToAccountReceivableDomain(
      accountReceivable,
    );
  }

  async findById(id: string): Promise<AccountReceivableDomain | null> {
    const accountReceivable = await this.prisma.accountReceivable.findUnique({
      where: {
        id,
      },
    });

    if (!accountReceivable) return null;
    return AccountReceivableRepositoryMap.mapPrismaAccountReceivableToAccountReceivableDomain(
      accountReceivable,
    );
  }
}
