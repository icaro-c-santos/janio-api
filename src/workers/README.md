# Report Worker

Sistema de worker para processamento assíncrono de relatórios.

## Funcionalidades

- **Processamento Automático**: Executa a cada 5 minutos
- **Status Management**: Atualiza status dos relatórios (PENDING → PROCESSING → READY/FAILED)
- **Worker Separado**: Não compete com recursos da API principal
- **Graceful Shutdown**: Encerramento seguro do worker
- **Logging**: Logs detalhados do processamento

## Como Funciona

1. **Cron Job**: Executa a cada 5 minutos
2. **Busca Relatórios**: Procura por relatórios com status `PENDING`
3. **Atualiza Status**: Muda para `PROCESSING`
4. **Executa Strategy**: Roda a strategy apropriada para o tipo de relatório
5. **Finaliza**: Atualiza para `READY` (sucesso) ou `FAILED` (erro)

## Executando o Worker

### Desenvolvimento

```bash
npm run worker:dev
```

### Produção

```bash
npm run worker
```

### Docker

```bash
docker-compose -f docker-compose.worker.yml up
```

## Estrutura

```
src/workers/
├── reports/
│   ├── report-processor.service.ts  # Lógica de processamento
│   └── report-worker.ts             # Worker principal com cron
├── start-worker.ts                  # Script de inicialização
└── README.md                        # Esta documentação
```

## Configuração

O worker usa as mesmas variáveis de ambiente da API:

- `DATABASE_URL`: Conexão com o banco de dados
- `BUCKET_NAME`: Nome do bucket para armazenamento
- `NODE_ENV`: Ambiente (development/production)

## Logs

O worker produz logs detalhados:

```
[ReportWorker] Starting report worker...
[ReportWorker] Report worker started. Processing every 5 minutes.
[ReportProcessor] Starting to process pending reports...
[ReportProcessor] Found 3 pending reports.
[ReportProcessor] Processing report abc-123...
[ReportProcessor] Report abc-123 processed successfully.
[ReportProcessor] Finished processing pending reports.
```

## Monitoramento

Para monitorar o worker:

1. **Logs**: Verifique os logs do container/processo
2. **Banco**: Consulte a tabela `Report` para ver status
3. **Métricas**: Status dos relatórios por tipo e período

## Troubleshooting

### Worker não processa relatórios

- Verifique se há relatórios com status `PENDING`
- Confirme se o worker está rodando
- Verifique logs de erro

### Relatórios ficam em `PROCESSING`

- Worker pode ter travado
- Verifique logs de erro
- Reinicie o worker se necessário

### Performance

- Worker processa até 100 relatórios por execução
- Intervalo de 5 minutos entre execuções
- Para alta demanda, considere múltiplos workers



