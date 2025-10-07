import { z } from 'zod';

export const downloadReportSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

