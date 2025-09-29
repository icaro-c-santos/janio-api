import { Result } from '../../../shared/types/result';
import { IAccountReceivableRepository } from '../domain/account-receivable.interface';
import { AccountReceivableMapResponse } from './mappers/accountReceivableToAccountReceivableResponse.mapper';
import {
  CreateAccountReceivableInput,
  CreateAccountReceivableResponse,
  ICreateAccountReceivableUseCase,
} from './types';

export class CreateAccountReceivableUseCase
  implements ICreateAccountReceivableUseCase
{
  constructor(
    private accountReceivableRepository: IAccountReceivableRepository,
  ) {}

  async execute(
    input: CreateAccountReceivableInput,
  ): Promise<Result<CreateAccountReceivableResponse>> {
    try {
      const data = {
        amount: input.amount,
        saleId: input.saleId || null,
        expectedDate: input.expectedDate || null,
        metadata: input.metadata || null,
        invoiceId: input.invoiceId || null,
      };

      const accountReceivable =
        await this.accountReceivableRepository.create(data);

      return {
        success: true,
        data: AccountReceivableMapResponse.mapAccountReceivableToResponse(
          accountReceivable,
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create account receivable',
      };
    }
  }
}
