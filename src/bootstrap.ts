import express from 'express';
import cors from 'cors';
import { registerRoutes } from './adapters/routes';
import { SaleController } from './modules/sales/controller/sales.controller';
import { appConfig } from './config';
import { prisma } from './infraestructure/db/prisma-client';
import { ProductRepository } from './modules/products/repository/product.repository';
import { S3StorageService } from './infraestructure/storage/minio-storage.service';
import { SaleRepository } from './modules/sales/repository/sale.repository';
import { CustomerRepository } from './modules/customers/repository/customer.repository';
import { CheckReadinessUseCase } from './modules/readlliness/usecases/check-readliness.useCase';
import { ReceiptService } from './modules/sales/services/receipt.service';
import { CreateSaleUseCase } from './modules/sales/usecases/createSale.useCase';
import { GetAllSalesUseCase } from './modules/sales/usecases/get-all-sales.use.case';
import { GetSaleByIdUseCase } from './modules/sales/usecases/getSaleById.useCase';
import { GetAllCustomersUseCase } from './modules/customers/usecases/get-all-customers.use.case';
import { CreateCustomerUseCase } from './modules/customers/usecases/create-customer.use.case';
import { GetProductByIdUseCase } from './modules/products/usecases/get-product-by-id.use.case';
import { GetProductPriceByCustomerIdUseCase } from './modules/products/usecases/get-product-price-by-custormer.use-case';
import { CheckReadinessController } from './modules/readlliness/controllers/checkReadliness.controller';
import { ProductController } from './modules/products/controller/product.controller';
import { CustomerController } from './modules/customers/controller/customer.controller';

export async function bootstrap() {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: '*',
    }),
  );

  const storage = new S3StorageService(appConfig.BUCKET_NAME);
  const saleRepository = new SaleRepository(prisma);
  const customerRepository = new CustomerRepository(prisma);
  const productRepository = new ProductRepository(prisma);

  const checkReadinessUseCase = new CheckReadinessUseCase(storage);
  const receiptService = new ReceiptService(storage);
  const createSaleUseCase = new CreateSaleUseCase(
    saleRepository,
    customerRepository,
    productRepository,
    receiptService,
  );
  const getAllSalesUseCase = new GetAllSalesUseCase(saleRepository);
  const getSaleByIdUseCase = new GetSaleByIdUseCase(
    saleRepository,
    receiptService,
  );
  const getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);

  const getProductPriceByCustomerIdUseCase =
    new GetProductPriceByCustomerIdUseCase(productRepository);

  const checkReadinessController = new CheckReadinessController(
    checkReadinessUseCase,
  );
  const saleController = new SaleController(
    createSaleUseCase,
    getAllSalesUseCase,
    getSaleByIdUseCase,
  );

  const customerController = new CustomerController(
    getAllCustomersUseCase,
    createCustomerUseCase,
  );

  const productController = new ProductController(
    getProductByIdUseCase,
    getProductPriceByCustomerIdUseCase,
  );

  registerRoutes(app, {
    checkReadinessController,
    saleController,
    customerController,
    productController,
  });

  return app;
}
