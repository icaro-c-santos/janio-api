import { Express } from 'express';
import multer from 'multer';
import { SaleController } from '../../modules/sales/controller/sales.controller';

import { ProductController } from '../../modules/products/controller/product.controller';
import { CustomerController } from '../../modules/customers/controller/customer.controller';
import { CheckReadinessController } from '../../modules/readlliness/controllers/checkReadliness.controller';
import { ReportController } from '../../modules/reports/controller/report.controller';

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
    reportController: ReportController;
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
    '/products',
    controllers.productController.getAllProducts.bind(
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

  app.get(
    '/reports',
    controllers.reportController.getAllReports.bind(
      controllers.reportController,
    ),
  );

  app.get(
    '/reports/:id',
    controllers.reportController.getReportById.bind(
      controllers.reportController,
    ),
  );

  app.post(
    '/reports',
    controllers.reportController.createReport.bind(
      controllers.reportController,
    ),
  );

  app.get(
    '/reports/types',
    controllers.reportController.getReportTypes.bind(
      controllers.reportController,
    ),
  );

  app.get(
    '/reports/:id/download',
    controllers.reportController.downloadReport.bind(
      controllers.reportController,
    ),
  );
}
