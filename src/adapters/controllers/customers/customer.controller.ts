import { Request, Response } from 'express';
import { getCustomersSchema } from './schemas/getCustomers.schema';
import { createCustomerSchema } from './schemas/createCustomer.schema';
import { GetAllCustomersUseCase } from '../../../aplication/usecases/customer/get-all-customers.use.case';
import { CreateCustomerUseCase } from '../../../aplication/usecases/customer/create-customer.use.case';
import {
  GetAllCustomersInput,
  CreateCustomerInput,
} from '../../../aplication/usecases/customer/types';
import { EPhoneType } from '../../../domain/interfaces/phone.interface';

export class CustomerController {
  constructor(
    private getAllCustomersUseCase: GetAllCustomersUseCase,
    private createCustomerUseCase: CreateCustomerUseCase,
  ) {}

  async getAllCustomers(req: Request, res: Response) {
    const validatedData = getCustomersSchema.safeParse({
      page: req.query.page,
      pageSize: req.query.pageSize,
    });
    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: GetAllCustomersInput = {
      pageSize: validatedData.data.pageSize,
      page: validatedData.data.page,
    };

    const result = await this.getAllCustomersUseCase.execute(request);

    if (result.success) {
      return res.status(201).json({
        success: true,
        data: result.data,
      });
    }

    const statusCode = result?.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: result.error,
    });
  }

  async createCustomer(req: Request, res: Response) {
    const validatedData = createCustomerSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: CreateCustomerInput = {
      user: {
        type: validatedData.data.user.type as unknown as
          | 'INDIVIDUAL'
          | 'COMPANY',
        email: validatedData.data.user.email,
        individual: validatedData.data.user.individual
          ? {
              cpf: validatedData.data.user.individual.cpf,
              fullName: validatedData.data.user.individual.fullName,
              birthDate: validatedData.data.user.individual.birthDate,
            }
          : undefined,
        company: validatedData.data.user.company
          ? {
              cnpj: validatedData.data.user.company.cnpj,
              legalName: validatedData.data.user.company.legalName,
              tradeName: validatedData.data.user.company.tradeName || '',
              stateRegistration:
                validatedData.data.user.company.stateRegistration || '',
            }
          : undefined,
        address: {
          street: validatedData.data.user.address.street,
          number: validatedData.data.user.address.number,
          district: validatedData.data.user.address.district,
          city: validatedData.data.user.address.city,
          state: validatedData.data.user.address.state,
          postalCode: validatedData.data.user.address.postalCode,
          country: validatedData.data.user.address.country,
        },
        phone: {
          areaCode: validatedData.data.user.phone.areaCode,
          number: validatedData.data.user.phone.number,
          isWhatsapp: validatedData.data.user.phone.isWhatsapp,
          type: validatedData.data.user.phone.type as unknown as EPhoneType,
        },
      } as any,
    };

    const result = await this.createCustomerUseCase.execute(request);

    if (result.success) {
      return res.status(201).json({
        success: true,
        data: result.data,
      });
    }

    return res.status(400).json({
      success: false,
      error: result.error,
    });
  }
}
