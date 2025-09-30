# Módulo de Relatórios

Este módulo implementa um sistema completo de geração de relatórios com diferentes tipos e estratégias.

## Funcionalidades

### 1. Obter todos os relatórios (GET /reports)

- **Paginação**: Segue o padrão do projeto com `page` e `pageSize`
- **Filtros disponíveis**:
  - `name`: Filtro por nome (busca case-insensitive)
  - `type`: Filtro por tipo de relatório
  - `status`: Filtro por status do relatório

**Exemplo de uso:**

```
GET /reports?page=1&pageSize=10&name=relatorio&type=DRE_MENSAL&status=PENDING
```

### 2. Obter relatório específico (GET /reports/:id)

- Retorna um relatório específico pelo ID

**Exemplo de uso:**

```
GET /reports/123e4567-e89b-12d3-a456-426614174000
```

### 3. Criar relatório (POST /reports)

- Cria um novo relatório e inicia o processamento de forma assíncrona
- Retorna o ID do relatório imediatamente
- O processamento acontece em background

**Exemplo de payload:**

```json
{
  "name": "Relatório DRE Mensal - Janeiro 2024",
  "description": "Demonstração do Resultado do Exercício para janeiro de 2024",
  "type": "DRE_MENSAL",
  "requestedBy": "user@example.com",
  "metadata": {
    "period": "2024-01"
  }
}
```

**Exemplo para relatórios por cliente:**

```json
{
  "name": "Relatório de Vendas Mensal - Cliente ABC",
  "description": "Relatório de vendas mensal para cliente específico",
  "type": "VENDAS_MENSAL_POR_CLIENTE",
  "requestedBy": "user@example.com",
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "productId": "987fcdeb-51a2-43d1-b456-426614174000"
}
```

**Validações para relatórios por cliente:**

- `customerId` e `productId` são obrigatórios
- Ambos devem ser UUIDs válidos
- Aplicável aos tipos: `VENDAS_MENSAL_POR_CLIENTE` e `VENDAS_ANUAL_POR_CLIENTE`

### 4. Obter tipos de relatórios (GET /reports/types)

- Retorna todos os tipos de relatórios e status disponíveis
- Inclui labels e descrições em português
- Útil para popular dropdowns e validações
- Implementado com Use Case e Repository seguindo padrão do projeto

**Exemplo de uso:**

```
GET /reports/types
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "types": [
      {
        "value": "DRE_MENSAL",
        "label": "DRE Mensal",
        "description": "Demonstração do Resultado do Exercício mensal"
      }
    ],
    "statuses": [
      {
        "value": "PENDING",
        "label": "Pendente",
        "description": "Relatório aguardando processamento"
      }
    ]
  }
}
```

### 5. Download de relatório (GET /reports/:id/download)

- Retorna URL de download temporária para relatórios prontos
- URL expira em 1 hora
- Valida se o relatório está com status READY
- Gera nome de arquivo baseado no tipo de relatório

**Exemplo de uso:**

```
GET /reports/123e4567-e89b-12d3-a456-426614174000/download
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "downloadUrl": "http://localhost:3000/api/reports/download/reports/test-file.pdf?expires=1703123456789",
    "fileName": "DRE_Mensal_2024-01-15.pdf",
    "expiresAt": "2024-01-15T15:30:00.000Z"
  }
}
```

**Validações:**

- Relatório deve existir
- Status deve ser READY
- Arquivo deve estar disponível (fileKey não nulo)
- ID deve ser um UUID válido

**Integração com Storage:**

- Utiliza o mesmo `storageService` usado para recibos de venda
- Gera URLs de download seguras com expiração
- Compatível com S3, MinIO e outros provedores de storage

## Tipos de Relatórios Disponíveis

### Enum ReportType

- `DRE_MENSAL` - DRE Mensal
- `DRE_ANUAL` - DRE Anual
- `VENDAS_MENSAL_POR_CLIENTE` - Vendas Mensal por Cliente (requer customerId no metadata)
- `VENDAS_MENSAL_GERAL` - Vendas Mensal Geral
- `VENDAS_ANUAL_POR_CLIENTE` - Vendas Anual por Cliente (requer customerId no metadata)
- `VENDAS_ANUAL_GERAL` - Vendas Anual Geral
- `ESTOQUE_MENSAL` - Estoque Mensal
- `ESTOQUE_ANUAL` - Estoque Anual

### Status dos Relatórios

- `PENDING` - Aguardando processamento
- `PROCESSING` - Em processamento
- `READY` - Pronto para download
- `FAILED` - Falha no processamento

## Estrutura do Módulo

```
src/modules/reports/
├── domain/
│   └── report.interface.ts          # Interfaces de domínio
├── repository/
│   ├── report.repository.ts         # Implementação do repositório
│   └── mappers/
│       └── mapPrismaReportToReport.mapper.ts
├── usecases/
│   ├── types.ts                     # Tipos dos use cases
│   ├── get-all-reports.use.case.ts
│   ├── get-report-by-id.use.case.ts
│   ├── create-report.use.case.ts
│   └── services/
│       └── report-execution.service.ts
├── controller/
│   ├── report.controller.ts         # Controller principal
│   └── schemas/                     # Schemas de validação
│       ├── getAllReports.schema.ts
│       ├── getReportById.schema.ts
│       └── createReport.schema.ts
└── strategies/                      # Estratégias de geração
    ├── report-strategy.interface.ts
    ├── report-strategy.factory.ts
    ├── dre-mensal.strategy.ts
    ├── dre-anual.strategy.ts
    ├── vendas-mensal-por-cliente.strategy.ts
    ├── vendas-mensal-geral.strategy.ts
    ├── vendas-anual-por-cliente.strategy.ts
    ├── vendas-anual-geral.strategy.ts
    ├── estoque-mensal.strategy.ts
    └── estoque-anual.strategy.ts
```

## Como Funciona

1. **Criação**: Quando um relatório é criado, ele é salvo no banco com status `PENDING`
2. **Processamento**: O `ReportExecutionService` é chamado de forma assíncrona
3. **Estratégia**: A factory seleciona a strategy apropriada baseada no tipo
4. **Execução**: A strategy executa a lógica específica do relatório
5. **Finalização**: O status é atualizado para `READY` ou `FAILED`

## Implementação das Strategies

As strategies atualmente retornam dados mock. Para implementar a lógica real:

1. Acesse os dados necessários do banco
2. Gere o arquivo do relatório (PDF, Excel, etc.)
3. Faça upload para o storage
4. Retorne o `fileKey` e `metadata` apropriados

## Exemplo de Implementação de Strategy

```typescript
export class DreMensalStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // 1. Buscar dados do banco
    const period = metadata?.period || new Date().toISOString().slice(0, 7);

    // 2. Gerar relatório
    const reportData = await this.generateDreData(period);

    // 3. Criar arquivo
    const fileBuffer = await this.createPdfReport(reportData);

    // 4. Upload para storage
    const fileKey = await this.storageService.upload(
      fileBuffer,
      `dre-mensal-${period}.pdf`,
    );

    return {
      fileKey,
      metadata: {
        period,
        generatedAt: new Date().toISOString(),
        totalRevenue: reportData.totalRevenue,
        totalExpenses: reportData.totalExpenses,
      },
    };
  }
}
```
