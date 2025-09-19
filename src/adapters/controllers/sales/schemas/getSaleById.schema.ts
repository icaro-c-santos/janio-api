import { z } from 'zod';

export const getSaleByIdSchema = z.object({
  id: z.string().uuid('Invalid sale ID format'),
});

export type GetSaleByIdInput = z.infer<typeof getSaleByIdSchema>;
