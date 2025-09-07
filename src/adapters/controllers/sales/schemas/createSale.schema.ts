import { z } from 'zod';

export const createSaleSchema = z.object({
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
  customerId: z.string().uuid({ message: 'customerId must be a valid UUID' }),

  quantity: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .int({ message: 'quantity must be an integer' })
      .positive({ message: 'quantity must be greater than 0' }),
  ),

  unitPrice: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'unitPrice must be greater than 0' }),
  ),

  totalPrice: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: 'totalPrice must be greater than 0' }),
  ),

  saleDate: z.preprocess(
    (val) => {
      if (val instanceof Date) return val;
      if (typeof val === 'string' || typeof val === 'number') {
        const date = new Date(val);
        return Number.isNaN(date.getTime()) ? undefined : date;
      }
      return undefined;
    },
    z.date({
      required_error: 'saleDate is required',
      invalid_type_error: 'saleDate must be a valid date',
    }),
  ),
});
