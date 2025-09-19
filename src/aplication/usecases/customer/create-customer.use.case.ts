import { ICustomerRepository } from '../../../domain/interfaces/customer.interface';
import { EPhoneType } from '../../../domain/interfaces/phone.interface';
import { Result } from '../../types/result';
import { CustomerMapResponse } from './mappers/customerToCustomeResponse.mapper';
import {
  CreateCustomerInput,
  CreateCustomerResponse,
  ICreateCustomerUseCase,
} from './types';

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    input: CreateCustomerInput,
  ): Promise<Result<CreateCustomerResponse>> {
    const existingCustomer = await this.customerRepository.findAll({
      email: input.user.email,
      cnpj: input.user.company?.cnpj,
      cpf: input.user.individual?.cpf,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
      take: 1,
      skip: 0,
    });
    if (existingCustomer.items.length > 0) {
      return {
        success: false,
        error: 'Customer already exists with this email, cnpj or cpf',
      };
    }
    const customer = await this.customerRepository.create({
      user: {
        type: input.user.type,
        email: input?.user?.email,
        individual: input.user.individual,
        company: input.user.company,
        address: {
          city: input.user.address.city,
          country: input.user.address.country,
          district: input.user.address.district,
          state: input.user.address.state,
          number: input.user.address.number,
          street: input.user.address.street,
          postalCode: input.user.address.postalCode,
          isPrimary: true,
        },
        phone: {
          areaCode: input.user.phone.areaCode,
          number: input.user.phone.number,
          isPrimary: true,
          isWhatsapp: input.user.phone.isWhatsapp,
          type: input.user.phone.type === EPhoneType.FIXED ? 'FIXED' : 'MOBILE',
        },
      },
    });

    return {
      success: true,
      data: CustomerMapResponse.mapCustomerToResponse(customer),
    };
  }
}
