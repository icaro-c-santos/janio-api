import { z } from 'zod';
import { ReportTypeDomain } from '../../domain/report.interface';

export const createReportSchema = z
  .object({
    name: z.string().min(1, { message: 'name is required' }),
    description: z.string().optional(),
    type: z.nativeEnum(ReportTypeDomain, {
      message: 'type must be a valid report type',
    }),
    requestedBy: z.string().optional(),
    customerId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
  })
  .refine(
    (data) => {
      const customerSpecificTypes = [
        ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE,
        ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE,
      ];

      if (customerSpecificTypes.includes(data.type)) {
        return data.customerId && data.productId;
      }
      return true;
    },
    {
      message:
        'customerId and productId are required for customer-specific report types',
      path: ['customerId'],
    },
  );
