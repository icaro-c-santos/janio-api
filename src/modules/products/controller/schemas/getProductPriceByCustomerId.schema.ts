import { z } from 'zod';

export const getProductPriceByCustomerIdSchema = z.object({
  customerId: z.string().uuid({ message: 'customerId must be a valid UUID' }),
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
});
