# GET /reports/:id/download

Endpoint para obter URL de download de um relatório.

## Descrição

Retorna uma URL de download temporária para um relatório que esteja com status READY. A URL possui expiração de 1 hora.

## Endpoint

```
GET /reports/:id/download
```

## Parâmetros

- `id` (string, obrigatório): UUID do relatório

## Resposta

### Sucesso (200)

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

### Erro - Relatório não encontrado (404)

```json
{
  "success": false,
  "error": "Report not found"
}
```

### Erro - Relatório não está pronto (400)

```json
{
  "success": false,
  "error": "Report is not ready for download"
}
```

### Erro - Arquivo não encontrado (400)

```json
{
  "success": false,
  "error": "Report file not found"
}
```

### Erro - ID inválido (400)

```json
{
  "success": false,
  "message": "INVALID DATA",
  "errors": [
    {
      "code": "invalid_string",
      "message": "id must be a valid UUID",
      "path": ["id"]
    }
  ]
}
```

## Campos de Resposta

- `downloadUrl`: URL temporária para download do arquivo
- `fileName`: Nome sugerido para o arquivo (inclui tipo e data)
- `expiresAt`: Data e hora de expiração da URL

## Regras de Negócio

1. **Status obrigatório**: O relatório deve estar com status `READY`
2. **Arquivo obrigatório**: O relatório deve ter um `fileKey` válido
3. **Expiração**: A URL expira em 1 hora
4. **Validação de ID**: O ID deve ser um UUID válido

## Nomes de Arquivo

Os nomes de arquivo são gerados automaticamente baseados no tipo de relatório:

- `DRE_MENSAL` → `DRE_Mensal_YYYY-MM-DD.pdf`
- `DRE_ANUAL` → `DRE_Anual_YYYY-MM-DD.pdf`
- `VENDAS_MENSAL_POR_CLIENTE` → `Vendas_Mensal_Cliente_YYYY-MM-DD.pdf`
- `VENDAS_MENSAL_GERAL` → `Vendas_Mensal_Geral_YYYY-MM-DD.pdf`
- `VENDAS_ANUAL_POR_CLIENTE` → `Vendas_Anual_Cliente_YYYY-MM-DD.pdf`
- `VENDAS_ANUAL_GERAL` → `Vendas_Anual_Geral_YYYY-MM-DD.pdf`
- `ESTOQUE_MENSAL` → `Estoque_Mensal_YYYY-MM-DD.pdf`
- `ESTOQUE_ANUAL` → `Estoque_Anual_YYYY-MM-DD.pdf`

## Exemplo de Uso

```javascript
// Buscar URL de download
const response = await fetch(
  '/reports/123e4567-e89b-12d3-a456-426614174000/download',
);
const data = await response.json();

if (data.success) {
  // Redirecionar para download ou abrir em nova aba
  window.open(data.data.downloadUrl, '_blank');

  // Ou fazer download programático
  const link = document.createElement('a');
  link.href = data.data.downloadUrl;
  link.download = data.data.fileName;
  link.click();
}
```

## Notas

- A URL de download é temporária e expira em 1 hora
- O arquivo deve estar processado (status READY) para ser baixado
- Utiliza o storageService (S3/MinIO) para gerar URLs de download seguras
- O nome do arquivo é sugestivo e pode ser alterado pelo usuário
- Integração com o mesmo sistema de storage usado para recibos de venda
