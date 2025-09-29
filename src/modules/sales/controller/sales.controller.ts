import { Request, Response } from 'express';
import { createSaleSchema } from './schemas/createSale.schema';
import { getSaleByIdSchema } from './schemas/getSaleById.schema';
import {
  CreateSaleInput,
  ICreateSaleUseCase,
  IGetAllSalesUseCase,
  IGetSaleByIdUseCase,
} from '../types';

export class SaleController {
  constructor(
    private createSaleUseCase: ICreateSaleUseCase,
    private getAllSalesUseCase: IGetAllSalesUseCase,
    private getSaleByIdUseCase: IGetSaleByIdUseCase,
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

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Sale created successfully',
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

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getAllSales(req: Request, res: Response) {
    const result = await this.getAllSalesUseCase.execute({});

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
}
