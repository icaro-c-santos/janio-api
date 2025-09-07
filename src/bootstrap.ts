import express from 'express';
import { Storage } from '@google-cloud/storage';
import { registerRoutes } from './adapters/routes';
import { SaleController } from './adapters/controllers/sales/sales.controller';
import { CreateSaleUseCase } from './aplication/usecases/sale/createSale.useCase';
import { GCPStorageService } from './infraestructure/storage/gcp-storage.service';
import { SaleRepository } from './infraestructure/repositories/sale.repository';
import { appConfig } from './config';
import { prisma } from './infraestructure/db/prisma-client';
import { CustomerRepository } from './infraestructure/repositories/customer.repository';
import { ProductRepository } from './infraestructure/repositories/product.repository';
import { CheckReadinessController } from './adapters/controllers/readliness/checkReadliness.controller';
import { CheckReadinessUseCase } from './aplication/usecases/readlliness/check-readliness.useCase';
import { GetAllCustomersUseCase } from './aplication/usecases/customer/get-all-customers.use.case';
import { CustomerController } from './adapters/controllers/customer/customer.controller';

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

  const saleRepository = new SaleRepository(prisma);
  const customerRepository = new CustomerRepository(prisma);
  const productRepository = new ProductRepository(prisma);

  const checkReadinessUseCase = new CheckReadinessUseCase(gCPStorageService);
  const createSaleUseCase = new CreateSaleUseCase(
    saleRepository,
    gCPStorageService,
    customerRepository,
    productRepository,
  );
  const getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);

  const checkReadinessController = new CheckReadinessController(
    checkReadinessUseCase,
  );
  const saleController = new SaleController(createSaleUseCase);

  const customerController = new CustomerController(getAllCustomersUseCase);
  registerRoutes(app, {
    checkReadinessController,
    saleController,
    customerController,
  });

  return app;
}
