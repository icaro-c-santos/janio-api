import { z } from 'zod';

export const appConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production'], {
    errorMap: () => ({
      message: 'APP_ENV must be one of: development, test, production',
    }),
  }),
  NODE_ENV: z.string().optional(),
  API_URL: z.string({ required_error: 'API_URL is required' }),
  API_SERVICE_NAME: z
    .string({
      required_error: 'API_SERVICE_NAME is required',
      invalid_type_error: 'API_SERVICE_NAME must be a string',
    })
    .min(5, 'API_SERVICE_NAME must be at least 5 characters long'),
  API_KEY: z
    .string({
      required_error: 'API_KEY is required',
      invalid_type_error: 'API_KEY must be a string',
    })
    .min(10, 'API_KEY must be at least 10 characters long'),
  API_PORT: z.coerce
    .number({
      required_error: 'API_PORT is required',
      invalid_type_error: 'API_PORT must be a number',
    })
    .min(3000, 'API_PORT must be a valid port number')
    .max(65535, 'API_PORT must be a valid port number'),

  OTL_COLETOR_URL: z
    .string({
      required_error: 'OTL_COLETOR_URL is required',
      invalid_type_error: 'OTL_COLETOR_URL must be a string',
    })
    .min(5, 'OTL_COLETOR_URL must be at least 5 characters long'),

  GOOGLE_CLOUD_TOKEN: z.string().optional(),
  POSTGRES_USER: z.string({ required_error: 'POSTGRES_USER is required' }),
  POSTGRES_PASSWORD: z.string({
    required_error: 'POSTGRES_PASSWORD is required',
  }),
  POSTGRES_DB: z.string({ required_error: 'POSTGRES_DB is required' }),
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }),
  MINIO_ENDPOINT: z.string({ required_error: 'MINIO_ENDPOINT is required' }),
  MINIO_ACCESS_KEY: z.string({
    required_error: 'MINIO_ACCESS_KEY is required',
  }),
  MINIO_SECRET_KEY: z.string({
    required_error: 'MINIO_SECRET_KEY is required',
  }),
  BUCKET_NAME: z
    .string({
      required_error: 'BUCKET_NAME is required',
      invalid_type_error: 'BUCKET_NAME must be a string',
    })
    .min(4, 'BUCKET_NAME must be at least 4 characters long'),
  mocksEnabled: z.boolean().default(false),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export type RequiredConfig = Optional<AppConfig, KeysWithFallbackValue>;

type KeysWithFallbackValue = 'mocksEnabled';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
