import { defineConfig } from '../defineConfig';

export function createLocalConfig() {
  return defineConfig({
    APP_ENV: 'local',
    API_URL: process.env.API_URL!,
    API_KEY: process.env.API_KEY!,
    API_PORT: process.env.API_PORT as unknown as number,
  });
}
