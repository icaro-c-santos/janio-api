import { Request, Response } from 'express';
import { CreateSaleUseCase } from '../../../aplication/usecases/sale/createSale.useCase';
import { createSaleSchema } from './schemas/createSale.schema';
import { getSaleByIdSchema } from './schemas/getSaleById.schema';
import { CreateSaleInput } from '../../../aplication/usecases/sale/types';
import { GetAllSalesUseCase } from '../../../aplication/usecases/sale/get-all-sales.use.case';
import { GetSaleByIdUseCase } from '../../../aplication/usecases/sale/getSaleById.useCase';

export class SaleController {
  constructor(
    private createSaleUseCase: CreateSaleUseCase,
    private getAllSalesUseCase: GetAllSalesUseCase,
    private getSaleByIdUseCase: GetSaleByIdUseCase,
  ) {}

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
      unitPrice: validatedData.data.unitPrice,
      saleDate: validatedData.data.saleDate,
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

  async getSaleById(req: Request, res: Response) {
    const validatedData = getSaleByIdSchema.safeParse(req.params);
    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const result = await this.getSaleByIdUseCase.execute({
      id: validatedData.data.id,
    });

    if (result.success) {
      return res.status(200).json({
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

  async getAllSales(req: Request, res: Response) {
    const result = await this.getAllSalesUseCase.execute();

    if (!result.success) {
      return res.status(400).json({
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  }
}
