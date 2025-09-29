import { BillingPlan as BillingPlanEntity } from '@prisma/client';
import {
  BillingPlanDomain,
  EBillingCycle,
} from '../../domain/billing-plan.interface';

export class BillingPlanRepositoryMap {
  public static mapPrismaBillingPlanToBillingPlan(
    billingPlanEntity: BillingPlanEntity,
  ): BillingPlanDomain {
    return {
      id: billingPlanEntity.id,
      customerId: billingPlanEntity.customerId,
      productId: billingPlanEntity.productId,
      cycle: billingPlanEntity.cycle as EBillingCycle,
      startDate: billingPlanEntity.startDate,
      endDate: billingPlanEntity.endDate,
      dueDay: billingPlanEntity.dueDay,
      createdAt: billingPlanEntity.createdAt,
      updatedAt: billingPlanEntity.updatedAt,
    };
  }
}
