import { Request, Response } from 'express';
import { getCustomersSchema } from './schemas/getCustomers.schema';
import { GetAllCustomersUseCase } from '../../../aplication/usecases/customer/get-all-customers.use.case';
import { GetAllCustomersInput } from '../../../aplication/usecases/customer/types';

export class CustomerController {
  constructor(private getAllCustomersUseCase: GetAllCustomersUseCase) {}

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
}
