import express from 'express';
import { Storage } from '@google-cloud/storage';
import { registerRoutes } from './adapters/routes';
import { CheckReadinessController } from './adapters/controllers/checkReadliness.controller';
import { CheckReadinessUseCase } from './aplication/usecases/checkReadliness.useCase';
import { GCPStorageService } from './infraestructure/storage/gcp-storage.service';
import { appConfig } from './config';

export async function bootstrap() {
  const app = express();

  const credentials = JSON.parse(appConfig.GCP_CREDENTIALS);
  const storage = new Storage({
    projectId: credentials.projectId,
    credentials,
  });
  const gCPStorageService = new GCPStorageService(
    appConfig.BUCKET_NAME,
    storage,
  );
  const checkReadinessUseCase = new CheckReadinessUseCase(gCPStorageService);
  const checkReadinessController = new CheckReadinessController(
    checkReadinessUseCase,
  );

  registerRoutes(app, { checkReadinessController });

  return app;
}
