import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from '../../../shared/types/repository';

export enum EBillingCycle {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
}
export type BillingPlanFindAllParams = RepositoryPaginatedInput & {
  customerId?: string;
  productId?: string;
  cycle?: EBillingCycle;
  isActive?: boolean;
};

export type CreateBillingPlanData = {
  customerId: string;
  productId: string;
  cycle: EBillingCycle;
  startDate: Date;
  endDate?: Date;
  dueDay?: number;
};

export type UpdateBillingPlanData = Partial<
  Omit<CreateBillingPlanData, 'customerId' | 'productId'>
>;

export interface IBillingPlanRepository {
  findById(id: string): Promise<BillingPlanDomain | null>;
  findAll(
    filter: BillingPlanFindAllParams,
  ): Promise<RepositoryPaginatedResult<BillingPlanDomain>>;
  create(billingPlan: CreateBillingPlanData): Promise<BillingPlanDomain>;
  upsert(billingPlan: CreateBillingPlanData): Promise<BillingPlanDomain>;
  update(
    id: string,
    billingPlan: UpdateBillingPlanData,
  ): Promise<BillingPlanDomain>;
  delete(id: string): Promise<void>;
  findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<BillingPlanDomain | null>;
  existsByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<boolean>;
}

export interface BillingPlanDomain {
  id: string;
  customerId: string;
  productId: string;
  cycle: EBillingCycle;
  startDate: Date;
  endDate: Date | null;
  dueDay: number | null;
  createdAt: Date;
  updatedAt: Date;
}
