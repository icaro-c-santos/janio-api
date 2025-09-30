import { Request, Response } from 'express';
import { getproductByIdSchema } from './schemas/getProductById.schema';
import { getProductPriceByCustomerIdSchema } from './schemas/getProductPriceByCustomerId.schema';
import {
  IGetProductByIdUseCase,
  IGetProductPriceByCustomerIdUseCase,
} from '../usecases/types';
import { IGetAllProductsUseCase } from '../usecases/get-all-products.use.case';

export class ProductController {
  constructor(
    private readonly getProductByIdUseCase: IGetProductByIdUseCase,
    private readonly getProductPriceByCustomerIdUseCase: IGetProductPriceByCustomerIdUseCase,
    private readonly getAllProductsUseCase: IGetAllProductsUseCase,
  ) {}

  async getProductById(req: Request, res: Response) {
    const id = req.params?.productId;
    const validatedData = getproductByIdSchema.safeParse({
      id,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const result = await this.getProductByIdUseCase.execute({
      id: validatedData.data.id,
    });

    if (!result.success) {
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.status(200).json(result.data);
  }

  async getProductPriceByCustomer(req: Request, res: Response) {
    const validatedData = getProductPriceByCustomerIdSchema.safeParse({
      customerId: req?.params.customerId,
      productId: req?.params.productId,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const result = await this.getProductPriceByCustomerIdUseCase.execute({
      customerId: validatedData.data.customerId,
      productId: validatedData.data.productId,
    });

    if (!result.success) {
      if (result.error === 'PRICE NOT FOUND') {
        return res.status(404).json({
          message: 'PRICE NOT FOUND',
        });
      }
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.status(200).json(result.data);
  }

  async getAllProducts(req: Request, res: Response) {
    const result = await this.getAllProductsUseCase.execute();

    if (!result.success) {
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  }
}
