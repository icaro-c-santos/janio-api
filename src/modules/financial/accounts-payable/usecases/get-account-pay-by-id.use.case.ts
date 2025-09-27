import { Result } from '../../../shared/types/result';
import { IAccountPayRepository } from '../domain/account-pay.interface';
import { AccountPayMapResponse } from './mappers/accountPayToAccountPayResponse.mapper';
import {
  GetAccountPayByIdInput,
  GetAccountPayByIdResponse,
  IGetAccountPayByIdUseCase,
} from './types';

export class GetAccountPayByIdUseCase implements IGetAccountPayByIdUseCase {
  constructor(private accountPayRepository: IAccountPayRepository) {}

  async execute(
    input: GetAccountPayByIdInput,
  ): Promise<Result<GetAccountPayByIdResponse>> {
    const data = await this.accountPayRepository.findById(input.id);

    if (!data) {
      return {
        success: false,
        error: 'ACCOUNT PAY NOT FOUND',
      };
    }

    return {
      success: true,
      data: AccountPayMapResponse.mapAccountPayToResponse(data),
    };
  }
}
