import express from 'express';
import cors from 'cors';
import { registerRoutes } from './adapters/routes';
import { SaleController } from './adapters/controllers/sales/sales.controller';
import { CreateSaleUseCase } from './aplication/usecases/sale/createSale.useCase';

import { appConfig } from './config';
import { prisma } from './infraestructure/db/prisma-client';

import { ProductRepository } from './infraestructure/repositories/products/product.repository';
import { CheckReadinessController } from './adapters/controllers/readliness/checkReadliness.controller';
import { CheckReadinessUseCase } from './aplication/usecases/readlliness/check-readliness.useCase';
import { GetAllCustomersUseCase } from './aplication/usecases/customer/get-all-customers.use.case';
import { GetProductByIdUseCase } from './aplication/usecases/products/get-product-by-id.use.case';
import { GetProductPriceByCustomerIdUseCase } from './aplication/usecases/products/get-product-price-by-custormer.use-case';
import { ProductController } from './adapters/controllers/products/product.controller';
import { CustomerController } from './adapters/controllers/customers/customer.controller';
import { S3StorageService } from './infraestructure/storage/minio-storage.service';
import { GetAllSalesUseCase } from './aplication/usecases/sale/get-all-sales.use.case';
import { SaleRepository } from './infraestructure/repositories/sales/sale.repository';
import { CustomerRepository } from './infraestructure/repositories/customers/customer.repository';

export async function bootstrap() {
  const app = express();

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
  const createSaleUseCase = new CreateSaleUseCase(
    saleRepository,
    storage,
    customerRepository,
    productRepository,
  );
  const getAllSalesUseCase = new GetAllSalesUseCase(saleRepository);
  const getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);

  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);

  const getProductPriceByCustomerIdUseCase =
    new GetProductPriceByCustomerIdUseCase(productRepository);

  const checkReadinessController = new CheckReadinessController(
    checkReadinessUseCase,
  );
  const saleController = new SaleController(
    createSaleUseCase,
    getAllSalesUseCase,
  );

  const customerController = new CustomerController(getAllCustomersUseCase);

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
