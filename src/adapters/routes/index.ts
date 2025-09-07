import { Express } from 'express';
import multer from 'multer';
import { SaleController } from '../controllers/sales/sales.controller';
import { CheckReadinessController } from '../controllers/readliness/checkReadliness.controller';
import { CustomerController } from '../controllers/customer/customer.controller';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
export function registerRoutes(
  app: Express,
  controllers: {
    checkReadinessController: CheckReadinessController;
    saleController: SaleController;
    customerController: CustomerController;
  },
) {
  app.get(
    '/readiness',
    controllers.checkReadinessController.readiness.bind(
      controllers.checkReadinessController,
    ),
  );

  app.get(
    '/customers',
    controllers.customerController.getAllCustomers.bind(
      controllers.customerController,
    ),
  );
  app.post(
    '/sales',
    upload.single('file'),
    controllers.saleController.createSale.bind(controllers.saleController),
  );
}
