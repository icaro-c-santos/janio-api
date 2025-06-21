import { createLocalConfig } from './envs/local';
import { createProdConfig } from './envs/prod';
import { createTestConfig } from './envs/test';

function getConfig() {
  switch (process.env.APP_ENV) {
    case 'production':
      return createProdConfig();
    case 'test':
      return createTestConfig();
    case 'development':
      return createLocalConfig();
    default:
      throw new Error(`Invalid APP_ENV "${process.env.APP_ENV}"`);
  }
}
export const appConfig = getConfig();
