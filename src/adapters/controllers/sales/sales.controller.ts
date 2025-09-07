import { Request, Response } from 'express';
import { CreateSaleUseCase } from '../../../aplication/usecases/sale/createSale.useCase';
import { createSaleSchema } from './schemas/createSale.schema';
import { CreateSaleInput } from '../../../aplication/usecases/sale/types';

export class SaleController {
  constructor(private createSaleUseCase: CreateSaleUseCase) {}

  async createSale(req: Request, res: Response) {
    const validatedData = createSaleSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: CreateSaleInput = {
      customerId: validatedData.data.customerId,
      productId: validatedData.data.productId,
      quantity: validatedData.data.quantity,
      totalPrice: validatedData.data.totalPrice,
      unitPrice: validatedData.data.unitPrice,
      file: req?.file || null,
    };

    const result = await this.createSaleUseCase.execute(request);

    if (result.success) {
      return res.status(201).json({
        success: true,
        data: result.data,
        message: 'Sale created successfully',
      });
    }

    const statusCode = result?.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: result.error,
    });
  }
}
