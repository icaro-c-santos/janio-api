import { Express } from 'express';
import { CheckReadinessController } from '../controllers/checkReadliness.controller';

export function registerRoutes(
  app: Express,
  controllers: { checkReadinessController: CheckReadinessController },
) {
  app.get(
    '/readiness',
    controllers.checkReadinessController.readiness.bind(
      controllers.checkReadinessController,
    ),
  );
}
