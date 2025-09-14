import { defineConfig } from '../defineConfig';

export function createLocalConfig() {
  return defineConfig({
    APP_ENV: process.env.APP_ENV! as 'development' | 'test' | 'production',
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.API_URL!,
    API_KEY: process.env.API_KEY!,
    API_PORT: Number(process.env.API_PORT),
    API_SERVICE_NAME: process.env.API_SERVICE_NAME!,
    OTL_COLETOR_URL: process.env.OTL_COLETOR_URL!,
    GOOGLE_CLOUD_TOKEN: process.env.GOOGLE_CLOUD_TOKEN || '',
    BUCKET_NAME: process.env.BUCKET_NAME!,
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    POSTGRES_DB: process.env.POSTGRES_DB!,
    DATABASE_URL: process.env.DATABASE_URL!,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
    mocksEnabled: process.env.MOCKS_ENABLED === 'true',
  });
}
