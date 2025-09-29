import {
  BillingPlanDomain,
  IBillingPlanRepository,
  EBillingCycle,
} from '../domain/billing-plan.interface';
import { ICustomerRepository } from '../../../customers/domain/customer.interface';
import { IProductRepository } from '../../../products/domain/product.interface';

export class BillingPlanService {
  constructor(
    private billingPlanRepository: IBillingPlanRepository,
    private customerRepository: ICustomerRepository,
    private productRepository: IProductRepository,
  ) {}

  async calculateExpectedDate(
    customerId: string,
    productId: string,
    saleDate: Date,
  ): Promise<Date> {
    const customer = await this.customerRepository.findById(customerId);
    const product = await this.productRepository.findById(productId);

    if (customer && product) {
      const billingPlan =
        await this.billingPlanRepository.findByCustomerAndProduct(
          customerId,
          productId,
        );
      if (billingPlan) {
        return this.calculateDateWithBillingPlan(saleDate, billingPlan);
      }
    }

    return this.calculateDefaultDate(saleDate);
  }

  private calculateDateWithBillingPlan(
    saleDate: Date,
    billingPlan: BillingPlanDomain,
  ): Date {
    const expected = new Date(saleDate);

    switch (billingPlan.cycle) {
      case EBillingCycle.DAILY:
        expected.setDate(expected.getDate() + 1);
        break;
      case EBillingCycle.WEEKLY:
        expected.setDate(expected.getDate() + 7);
        break;
      case EBillingCycle.MONTHLY:
        expected.setMonth(expected.getMonth() + 1);
        break;
      default:
        expected.setMonth(expected.getMonth() + 1);
    }

    // Se tem dueDay definido, usar ele, senão usar dia 10
    const dueDay = billingPlan.dueDay || 10;
    expected.setDate(dueDay);

    return expected;
  }

  private calculateDefaultDate(saleDate: Date): Date {
    const expected = new Date(saleDate);
    expected.setMonth(expected.getMonth() + 1);
    expected.setDate(10);
    return expected;
  }
}
