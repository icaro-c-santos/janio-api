import { PrismaClient } from '@prisma/client';
import {
  AccountPayDomain,
  IAccountPayRepository,
} from '../domain/account-pay.interface';
import { AccountPayableRepositoryMap } from './mappers/mapPrismaAccountPayToAccountPayDomain.mapper';

export class AccountRepository implements IAccountPayRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<AccountPayDomain | null> {
    const accountPay = await this.prisma.accountPayable.findUnique({
      where: {
        id,
      },
    });

    if (!accountPay) return null;
    return AccountPayableRepositoryMap.mapPrismaCustomerToCustomer(accountPay);
  }
}
