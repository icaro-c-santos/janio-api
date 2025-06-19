import { defineConfig } from '../defineConfig';

export function createProdConfig() {
  return defineConfig({
    APP_ENV: 'production',
    API_URL: process.env.API_URL!,
    API_KEY: process.env.API_KEY!,
    API_PORT: process.env.API_PORT as unknown as number,
  });
}
