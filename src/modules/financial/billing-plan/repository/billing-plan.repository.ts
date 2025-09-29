import { PrismaClient } from '@prisma/client';
import {
  IBillingPlanRepository,
  BillingPlanDomain,
  BillingPlanFindAllParams,
  CreateBillingPlanData,
  UpdateBillingPlanData,
} from '../domain/billing-plan.interface';
import { BillingPlanRepositoryMap } from './mappers/mapPrismaBillingPlanToBillingPlan.mapper';

export class BillingPlanRepository implements IBillingPlanRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<BillingPlanDomain | null> {
    const billingPlan = await this.prisma.billingPlan.findUnique({
      where: { id },
    });

    return billingPlan
      ? BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(billingPlan)
      : null;
  }

  async findAll(filter: BillingPlanFindAllParams): Promise<{
    total: number;
    take: number;
    skip: number;
    items: BillingPlanDomain[];
  }> {
    const { skip, take, customerId, productId, cycle, isActive } = filter;

    const whereConditions: any = {};

    if (customerId) {
      whereConditions.customerId = customerId;
    }

    if (productId) {
      whereConditions.productId = productId;
    }

    if (cycle) {
      whereConditions.cycle = cycle;
    }

    if (isActive !== undefined) {
      if (isActive) {
        whereConditions.OR = [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ];
      } else {
        whereConditions.endDate = { lt: new Date() };
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.billingPlan.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.billingPlan.count({
        where: whereConditions,
      }),
    ]);

    return {
      total,
      take,
      skip,
      items: items.map((billingPlan) =>
        BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(billingPlan),
      ),
    };
  }

  async create(billingPlan: CreateBillingPlanData): Promise<BillingPlanDomain> {
    const newBillingPlan = await this.prisma.billingPlan.create({
      data: {
        customerId: billingPlan.customerId,
        productId: billingPlan.productId,
        cycle: billingPlan.cycle,
        startDate: billingPlan.startDate,
        endDate: billingPlan.endDate,
        dueDay: billingPlan.dueDay,
      },
    });

    return BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(
      newBillingPlan,
    );
  }

  async upsert(billingPlan: CreateBillingPlanData): Promise<BillingPlanDomain> {
    const upsertedBillingPlan = await this.prisma.billingPlan.upsert({
      where: {
        customerId_productId: {
          customerId: billingPlan.customerId,
          productId: billingPlan.productId,
        },
      },
      update: {
        cycle: billingPlan.cycle,
        startDate: billingPlan.startDate,
        endDate: billingPlan.endDate,
        dueDay: billingPlan.dueDay,
      },
      create: {
        customerId: billingPlan.customerId,
        productId: billingPlan.productId,
        cycle: billingPlan.cycle,
        startDate: billingPlan.startDate,
        endDate: billingPlan.endDate,
        dueDay: billingPlan.dueDay,
      },
    });

    return BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(
      upsertedBillingPlan,
    );
  }

  async update(
    id: string,
    billingPlan: UpdateBillingPlanData,
  ): Promise<BillingPlanDomain> {
    const updatedBillingPlan = await this.prisma.billingPlan.update({
      where: { id },
      data: {
        cycle: billingPlan.cycle,
        startDate: billingPlan.startDate,
        endDate: billingPlan.endDate,
        dueDay: billingPlan.dueDay,
      },
    });

    return BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(
      updatedBillingPlan,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.billingPlan.delete({
      where: { id },
    });
  }

  async findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<BillingPlanDomain | null> {
    const billingPlan = await this.prisma.billingPlan.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    });

    return billingPlan
      ? BillingPlanRepositoryMap.mapPrismaBillingPlanToBillingPlan(billingPlan)
      : null;
  }

  async existsByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<boolean> {
    const billingPlan = await this.prisma.billingPlan.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      select: { id: true },
    });

    return billingPlan !== null;
  }
}
