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
import { GetAllProductsUseCase } from './modules/products/usecases/get-all-products.use.case';
import { CheckReadinessController } from './modules/readlliness/controllers/checkReadliness.controller';
import { ProductController } from './modules/products/controller/product.controller';
import { CustomerController } from './modules/customers/controller/customer.controller';
import { ReportController } from './modules/reports/controller/report.controller';
import { ReportRepository } from './modules/reports/repository/report.repository';
import { GetAllReportsUseCase } from './modules/reports/usecases/get-all-reports.use.case';
import { GetReportByIdUseCase } from './modules/reports/usecases/get-report-by-id.use.case';
import { CreateReportUseCase } from './modules/reports/usecases/create-report.use.case';
import { ReportExecutionService } from './modules/reports/usecases/services/report-execution.service';
import { ReportStrategyFactory } from './modules/reports/strategies/report-strategy.factory';
import { PrismaTransaction } from './modules/shared/types/transactions';
import { BillingPlanRepository } from './modules/financial/billing-plan/repository/billing-plan.repository';
import { BillingPlanService } from './modules/financial/billing-plan/services/billingPlanService ';
import { AccountReceivableRepository } from './modules/financial/accounts-receivable/repository/accounts-receivable.repository';
import { ReportTypesRepository } from './modules/reports/repository/report-types.repository';
import { GetReportTypesUseCase } from './modules/reports/usecases/get-report-types.use.case';
import { DownloadReportUseCase } from './modules/reports/usecases/download-report.use.case';

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
  const reportRepository = new ReportRepository(prisma);
  const reportTypesRepository = new ReportTypesRepository();
  const billingPlanRepository = new BillingPlanRepository(prisma);
  const accountReceivableRepository = new AccountReceivableRepository(prisma);

  const prismaTransaction = new PrismaTransaction(prisma, {
    accountReceivableRepository,
    saleRepository,
  });

  const checkReadinessUseCase = new CheckReadinessUseCase(storage);
  const receiptService = new ReceiptService(storage);

  const billingPlanService = new BillingPlanService(
    billingPlanRepository,
    customerRepository,
    productRepository,
  );

  const createSaleUseCase = new CreateSaleUseCase(
    prismaTransaction,
    customerRepository,
    productRepository,
    receiptService,
    billingPlanService,
  );
  const getAllSalesUseCase = new GetAllSalesUseCase(saleRepository);
  const getSaleByIdUseCase = new GetSaleByIdUseCase(
    saleRepository,
    receiptService,
  );
  const getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

  const getProductPriceByCustomerIdUseCase =
    new GetProductPriceByCustomerIdUseCase(productRepository);

  const getAllReportsUseCase = new GetAllReportsUseCase(reportRepository);
  const getReportByIdUseCase = new GetReportByIdUseCase(reportRepository);
  const createReportUseCase = new CreateReportUseCase(reportRepository);
  const getReportTypesUseCase = new GetReportTypesUseCase(
    reportTypesRepository,
  );
  const downloadReportUseCase = new DownloadReportUseCase(
    reportRepository,
    storage,
  );

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
    getAllProductsUseCase,
  );

  const reportController = new ReportController(
    getAllReportsUseCase,
    getReportByIdUseCase,
    createReportUseCase,
    getReportTypesUseCase,
    downloadReportUseCase,
  );

  registerRoutes(app, {
    checkReadinessController,
    saleController,
    customerController,
    productController,
    reportController,
  });

  return app;
}
