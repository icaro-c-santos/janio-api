/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from '@prisma/client';

export interface ITransactionContext {
  [key: string]: any;
}

export interface ITransaction {
  /**
   * Executa um bloco de código dentro de uma transação.
   * @param callback Função que recebe o contexto transacional (tx) com repositórios ligados à transação.
   */
  run<T>(callback: (tx: ITransactionContext) => Promise<T>): Promise<T>;
}

export class PrismaTransaction implements ITransaction {
  constructor(
    private prisma: PrismaClient,
    private repositories: { [key: string]: any },
  ) {}

  async run<T>(callback: (tx: ITransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (txClient) => {
      const txContext: ITransactionContext = {};

      for (const [key, repo] of Object.entries(this.repositories)) {
        if (typeof repo.withTransaction === 'function') {
          txContext[key] = repo.withTransaction(txClient);
        } else {
          txContext[key] = repo;
        }
      }

      return callback(txContext);
    });
  }
}
