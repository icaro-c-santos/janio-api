# GET /reports/types

Endpoint para obter os tipos de relatórios e status disponíveis.

## Descrição

Retorna uma lista completa dos tipos de relatórios e status disponíveis no sistema, incluindo labels e descrições em português.

## Endpoint

```
GET /reports/types
```

## Resposta

### Sucesso (200)

```json
{
  "success": true,
  "data": {
    "types": [
      {
        "value": "DRE_MENSAL",
        "label": "DRE Mensal",
        "description": "Demonstração do Resultado do Exercício mensal"
      },
      {
        "value": "DRE_ANUAL",
        "label": "DRE Anual",
        "description": "Demonstração do Resultado do Exercício anual"
      },
      {
        "value": "VENDAS_MENSAL_POR_CLIENTE",
        "label": "Vendas Mensal por Cliente",
        "description": "Relatório de vendas mensal para um cliente específico"
      },
      {
        "value": "VENDAS_MENSAL_GERAL",
        "label": "Vendas Mensal Geral",
        "description": "Relatório geral de vendas mensal"
      },
      {
        "value": "VENDAS_ANUAL_POR_CLIENTE",
        "label": "Vendas Anual por Cliente",
        "description": "Relatório de vendas anual para um cliente específico"
      },
      {
        "value": "VENDAS_ANUAL_GERAL",
        "label": "Vendas Anual Geral",
        "description": "Relatório geral de vendas anual"
      },
      {
        "value": "ESTOQUE_MENSAL",
        "label": "Estoque Mensal",
        "description": "Relatório de estoque mensal"
      },
      {
        "value": "ESTOQUE_ANUAL",
        "label": "Estoque Anual",
        "description": "Relatório de estoque anual"
      }
    ],
    "statuses": [
      {
        "value": "PENDING",
        "label": "Pendente",
        "description": "Relatório aguardando processamento"
      },
      {
        "value": "PROCESSING",
        "label": "Processando",
        "description": "Relatório sendo processado"
      },
      {
        "value": "READY",
        "label": "Pronto",
        "description": "Relatório processado e pronto para download"
      },
      {
        "value": "FAILED",
        "label": "Falhou",
        "description": "Falha no processamento do relatório"
      }
    ]
  }
}
```

## Campos de Resposta

### Types

- `value`: Valor do enum para uso na API
- `label`: Nome amigável em português
- `description`: Descrição detalhada do tipo de relatório

### Statuses

- `value`: Valor do enum para uso na API
- `label`: Nome amigável em português
- `description`: Descrição do status

## Casos de Uso

1. **Frontend**: Popular dropdowns de seleção de tipo e status
2. **Validação**: Validar tipos e status antes de criar relatórios
3. **Documentação**: Mostrar opções disponíveis para usuários
4. **Integração**: APIs externas podem consultar tipos disponíveis

## Exemplo de Uso

```javascript
// Buscar tipos de relatórios
const response = await fetch('/reports/types');
const data = await response.json();

// Usar em dropdown
const typeOptions = data.data.types.map((type) => ({
  value: type.value,
  label: type.label,
}));

// Usar em filtros
const statusOptions = data.data.statuses.map((status) => ({
  value: status.value,
  label: status.label,
}));
```

## Arquitetura

### Use Case

- **GetReportTypesUseCase**: Orquestra a obtenção dos tipos e status
- **ReportTypesRepository**: Contém a lógica de mapeamento e labels

### Fluxo

1. Controller recebe requisição
2. Use Case é executado
3. Repository retorna tipos e status mapeados
4. Resposta é formatada e retornada

## Validação de customerId e productId

Para relatórios específicos por cliente, os campos `customerId` e `productId` são obrigatórios no metadata:

### Tipos que requerem customerId e productId:

- `VENDAS_MENSAL_POR_CLIENTE`
- `VENDAS_ANUAL_POR_CLIENTE`

### Exemplo de payload válido:

```json
{
  "name": "Relatório de Vendas Mensal - Cliente ABC",
  "type": "VENDAS_MENSAL_POR_CLIENTE",
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "productId": "987fcdeb-51a2-43d1-b456-426614174000"
}
```

### Validações:

- **Obrigatório**: Para tipos específicos por cliente
- **Formato**: Deve ser um UUID válido
- **Tipo**: String
- **Campos**: customerId e productId

## Notas

- Este endpoint não requer autenticação
- Resposta é sempre em português
- Valores são consistentes com os enums do sistema
- Útil para construção de interfaces de usuário
- Segue padrão de arquitetura do projeto (Repository + Use Case)
- Validação automática de customerId para relatórios específicos por cliente
