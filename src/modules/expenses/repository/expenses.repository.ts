import { PrismaClient } from '@prisma/client';
import {
  IExpenseRepository,
  CreateExpenseData,
  ExpenseDomain,
  ExpenseTypeDomain,
  ExpenseFindAllParams,
} from '../domain/expense.interface';
import { ExpenseRepositoryMap } from './mappers/mapPrismaExpenseToExpense.mapper';

export class ExpenseRepository implements IExpenseRepository {
  constructor(private prisma: PrismaClient) {}

  async create(expenseData: CreateExpenseData): Promise<ExpenseDomain> {
    const data: any = {
      description: expenseData.description,
      totalValue: expenseData.totalValue,
      receiptFileKey: expenseData?.receiptFileKey || null,
    };

    if (expenseData.expenseTypeId) {
      data.expenseTypeId = expenseData.expenseTypeId;
    }

    const expense = await this.prisma.expense.create({
      data,
      include: {
        expenseType: !!expenseData.expenseTypeId,
      },
    });

    return ExpenseRepositoryMap.mapPrismaExpenseToExpense(expense);
  }

  async getById(id: string): Promise<ExpenseDomain | null> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
      },
      include: {
        expenseType: true,
      },
    });

    if (!expense) {
      return null;
    }

    return ExpenseRepositoryMap.mapPrismaExpenseToExpense(expense);
  }

  async getAll(filter: ExpenseFindAllParams): Promise<ExpenseDomain[]> {
    const { skip, take } = filter;

    const expenses = await this.prisma.expense.findMany({
      include: {
        expenseType: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return expenses.map((expense) =>
      ExpenseRepositoryMap.mapPrismaExpenseToExpense(expense),
    );
  }

  async getAllCategories(): Promise<ExpenseTypeDomain[]> {
    const expenseTypes = await this.prisma.expenseType.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return expenseTypes.map((expenseType) =>
      ExpenseRepositoryMap.mapPrismaExpenseTypeToExpenseType(expenseType),
    );
  }

  async getExpenseTypeById(id: string): Promise<ExpenseTypeDomain | null> {
    const expenseType = await this.prisma.expenseType.findUnique({
      where: {
        id,
      },
    });

    if (!expenseType) {
      return null;
    }

    return ExpenseRepositoryMap.mapPrismaExpenseTypeToExpenseType(expenseType);
  }
}
