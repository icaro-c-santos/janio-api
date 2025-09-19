import { Express } from 'express';
import multer from 'multer';
import { SaleController } from '../controllers/sales/sales.controller';
import { CheckReadinessController } from '../controllers/readliness/checkReadliness.controller';
import { ProductController } from '../controllers/products/product.controller';
import { CustomerController } from '../controllers/customers/customer.controller';

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
    productController: ProductController;
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
    '/customers',
    controllers.customerController.createCustomer.bind(
      controllers.customerController,
    ),
  );

  app.get(
    '/products/:productId/price/:customerId/',
    controllers.productController.getProductPriceByCustomer.bind(
      controllers.productController,
    ),
  );

  app.get(
    '/products/:productId',
    controllers.productController.getProductById.bind(
      controllers.productController,
    ),
  );

  app.get(
    '/sales',
    controllers.saleController.getAllSales.bind(controllers.saleController),
  );

  app.get(
    '/sales/:id',
    controllers.saleController.getSaleById.bind(controllers.saleController),
  );

  app.post(
    '/sales',
    upload.single('file'),
    controllers.saleController.createSale.bind(controllers.saleController),
  );
}
