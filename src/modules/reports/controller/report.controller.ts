import { Request, Response } from 'express';
import {
  CreateReportInput,
  GetAllReportsInput,
  GetReportByIdInput,
  ICreateReportUseCase,
  IGetAllReportsUseCase,
  IGetReportByIdUseCase,
} from '../usecases/types';
import { getAllReportsSchema } from './schemas/getAllReports.schema';
import { createReportSchema } from './schemas/createReport.schema';
import { getReportByIdSchema } from './schemas/getReportById.schema';
import { IGetReportTypesUseCase } from '../usecases/types/getReportTypes.types';
import {
  IDownloadReportUseCase,
  DownloadReportInput,
} from '../usecases/types/downloadReport.types';
import { downloadReportSchema } from './schemas/downloadReport.schema';

export class ReportController {
  constructor(
    private getAllReportsUseCase: IGetAllReportsUseCase,
    private getReportByIdUseCase: IGetReportByIdUseCase,
    private createReportUseCase: ICreateReportUseCase,
    private getReportTypesUseCase: IGetReportTypesUseCase,
    private downloadReportUseCase: IDownloadReportUseCase,
  ) {}

  async getAllReports(req: Request, res: Response) {
    const validatedData = getAllReportsSchema.safeParse({
      page: req.query.page,
      pageSize: req.query.pageSize,
      name: req.query.name,
      type: req.query.type,
      status: req.query.status,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: GetAllReportsInput = {
      pageSize: validatedData.data.pageSize,
      page: validatedData.data.page,
      name: validatedData.data.name,
      type: validatedData.data.type,
      status: validatedData.data.status,
    };

    const result = await this.getAllReportsUseCase.execute(request);

    return res.status(200).json(result);
  }

  async getReportById(req: Request, res: Response) {
    const validatedData = getReportByIdSchema.safeParse({
      id: req.params.id,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: GetReportByIdInput = {
      id: validatedData.data.id,
    };

    const result = await this.getReportByIdUseCase.execute(request);

    if (result) {
      return res.status(200).json(result);
    }

    return res.status(404).json();
  }

  async createReport(req: Request, res: Response) {
    const validatedData = createReportSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: CreateReportInput = {
      name: validatedData.data.name,
      description: validatedData.data.description,
      type: validatedData.data.type,
      requestedBy: validatedData.data.requestedBy,
      customerId: validatedData.data.customerId,
      productId: validatedData.data.productId,
    };

    const result = await this.createReportUseCase.execute(request);

    return res.status(201).json(result);
  }

  async getReportTypes(req: Request, res: Response) {
    const result = await this.getReportTypesUseCase.execute();

    return res.status(200).json(result);
  }

  async downloadReport(req: Request, res: Response) {
    const validatedData = downloadReportSchema.safeParse({
      id: req.params.id,
    });

    if (!validatedData.success) {
      return res.status(400).json({
        message: 'INVALID DATA',
        errors: validatedData.error.errors,
      });
    }

    const request: DownloadReportInput = {
      id: validatedData.data.id,
    };

    const result = await this.downloadReportUseCase.execute(request);
    return res.status(200).json(result);
  }
}
