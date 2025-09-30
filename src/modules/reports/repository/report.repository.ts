import { PrismaClient, ReportStatus } from '@prisma/client';
import {
  IReportRepository,
  CreateReportData,
  ReportFindAllParams,
  UpdateReportData,
} from '../domain/report.interface';
import { ReportRepositoryMap } from './mappers/mapPrismaReportToReport.mapper';

export class ReportRepository implements IReportRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id, deletedAt: null },
    });

    if (report) {
      return ReportRepositoryMap.mapPrismaReportToReport(report);
    }

    return null;
  }

  async findAll(filter: ReportFindAllParams) {
    const { skip, take, name, type, status } = filter;

    const whereConditions: any = { deletedAt: null };

    if (name) {
      whereConditions.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (type) {
      whereConditions.type = type;
    }

    if (status) {
      whereConditions.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.report.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({
        where: whereConditions,
      }),
    ]);

    return {
      total,
      take,
      skip,
      items: items.map((report) =>
        ReportRepositoryMap.mapPrismaReportToReport(report),
      ),
    };
  }

  async create(report: CreateReportData) {
    const newReport = await this.prisma.report.create({
      data: {
        name: report.name,
        description: report.description,
        type: report.type,
        requestedBy: report.requestedBy,
        metadata: report.metadata,
        status: report.status,
      },
    });

    return ReportRepositoryMap.mapPrismaReportToReport(newReport);
  }

  async update(id: string, data: UpdateReportData) {
    const updatedReport = await this.prisma.report.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status && { status: data.status as any }),
        ...(data.fileKey !== undefined && { fileKey: data.fileKey }),
        ...(data.metadata !== undefined && { metadata: data.metadata }),
        updatedAt: new Date(),
      },
    });

    return ReportRepositoryMap.mapPrismaReportToReport(updatedReport);
  }

  async delete(id: string) {
    await this.prisma.report.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
