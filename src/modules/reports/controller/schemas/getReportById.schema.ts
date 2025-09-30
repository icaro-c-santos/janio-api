import { z } from 'zod';

export const getReportByIdSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});
