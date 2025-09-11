import { z } from 'zod';

export const getCustomersSchema = z.object({
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
});
