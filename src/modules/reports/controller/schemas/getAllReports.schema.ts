import { z } from 'zod';
import {
  ReportTypeDomain,
  ReportStatusDomain,
} from '../../domain/report.interface';

export const getAllReportsSchema = z.object({
  page: z
    .preprocess(
      (val) => Number(val),
      z
        .number()
        .int({ message: 'page must be an integer' })
        .positive({ message: 'page must be greater than 0' }),
    )
    .optional(),
  pageSize: z
    .preprocess(
      (val) => Number(val),
      z
        .number()
        .int({ message: 'pageSize must be an integer' })
        .positive({ message: 'pageSize must be greater than 0' }),
    )
    .optional(),
  name: z.string().optional(),
  type: z.nativeEnum(ReportTypeDomain).optional(),
  status: z.nativeEnum(ReportStatusDomain).optional(),
});
