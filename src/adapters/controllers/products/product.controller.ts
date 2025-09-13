import { Request, Response } from 'express';
import { GetProductByIdUseCase } from '../../../aplication/usecases/products/get-product-by-id.use.case';
import { getproductByIdSchema } from './schemas/getProductById.schema';

export class ProductController {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {}

  async getProductById(req: Request, res: Response) {
    const id = req.params?.id;

    const validatedData = getproductByIdSchema.safeParse({
      id,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const result = await this.getProductByIdUseCase.execute({ id });

    if (!result.success) {
      return res.status(400).json({
        message: result.error,
      });
    }

    return res.status(200).json(result.data);
  }
}
