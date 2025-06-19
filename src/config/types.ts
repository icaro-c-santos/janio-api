import { z } from 'zod';

export const appConfigSchema = z.object({
  APP_ENV: z.enum(['local', 'test', 'production'], {
    errorMap: () => ({
      message: 'APP_ENV must be one of: local, test, production',
    }),
  }),
  API_URL: z.string({ required_error: 'API_URL is required' }),
  API_KEY: z
    .string({
      required_error: 'API_KEY is required',
      invalid_type_error: 'API_KEY must be a string',
    })
    .min(10, 'API_KEY must be at least 10 characters long'),
  mocksEnabled: z.boolean().default(false),
  API_PORT: z.coerce
    .number({
      required_error: 'API_PORT is required',
      invalid_type_error: 'API_PORT must be a number',
    })
    .min(3000, 'API_PORT must be a valid port number')
    .max(65535, 'API_PORT must be a valid port number'),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export type RequiredConfig = Optional<AppConfig, KeysWithFallbackValue>;

type KeysWithFallbackValue = 'mocksEnabled';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
