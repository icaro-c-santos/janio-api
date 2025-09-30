export interface WorkerConfig {
  cronExpression: string;
  timezone: string;
  maxReportsPerBatch: number;
  retryAttempts: number;
  retryDelay: number;
}

export const workerConfig: WorkerConfig = {
  // Executar a cada 5 minutos
  cronExpression: '*/5 * * * *',

  // Timezone do Brasil
  timezone: 'America/Sao_Paulo',

  // Processar até 100 relatórios por execução
  maxReportsPerBatch: 100,

  // Tentativas de retry em caso de erro
  retryAttempts: 3,

  // Delay entre tentativas (em ms)
  retryDelay: 5000,
};

export const getWorkerConfig = (): WorkerConfig => {
  return {
    ...workerConfig,
    // Permitir override via variáveis de ambiente
    cronExpression:
      process.env.WORKER_CRON_EXPRESSION || workerConfig.cronExpression,
    timezone: process.env.WORKER_TIMEZONE || workerConfig.timezone,
    maxReportsPerBatch: parseInt(
      process.env.WORKER_MAX_REPORTS ||
        workerConfig.maxReportsPerBatch.toString(),
    ),
    retryAttempts: parseInt(
      process.env.WORKER_RETRY_ATTEMPTS ||
        workerConfig.retryAttempts.toString(),
    ),
    retryDelay: parseInt(
      process.env.WORKER_RETRY_DELAY || workerConfig.retryDelay.toString(),
    ),
  };
};


