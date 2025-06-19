# 🥥 CocoDistrib API — Sistema de Gestão para Distribuidora de Água de Coco

## 🚀 Descrição do Projeto

**CocoDistrib API** é uma API robusta, escalável e moderna, desenvolvida para atender as necessidades operacionais de uma distribuidora de água de coco. O sistema centraliza e automatiza os principais processos do negócio, como:

- ✔️ Gestão de Vendas  
- ✔️ Controle de Estoque  
- ✔️ Gestão de Compras e Fornecedores  
- ✔️ Controle Financeiro (Contas a Pagar e Receber)  
- ✔️ Gestão de Clientes e Precificação Individual  

O projeto foi desenvolvido com foco em **alta manutenibilidade, escalabilidade e testabilidade**, utilizando as melhores práticas de desenvolvimento backend com **Node.js na versão 22**.

---

## 🏗️ Padrões e Arquitetura

O projeto segue rigorosamente os princípios da **Arquitetura Limpa (Clean Architecture)**, promovendo:

- ✅ Independência de frameworks  
- ✅ Independência da interface (UI, banco ou APIs externas)  
- ✅ Testabilidade elevada  
- ✅ Facilidade para evolução, manutenção e escalabilidade  

Além disso, foi aplicado um rigoroso padrão de organização de código, separando responsabilidades em camadas bem definidas:

- **Domain** → Entidades, regras de negócio e contratos  
- **Application** → Casos de uso (use-cases), serviços de aplicação  
- **Infrastructure** → Integrações com banco de dados, serviços externos, providers  
- **Interfaces / Adapters** → APIs (HTTP/REST), Controllers, Middlewares  

---

## 🛠️ Tecnologias e Ferramentas

- 🟩 **Node.js 22 (versão LTS mais recente)**  
- ✨ **TypeScript**  
- ✅ **ESLint (versão mais recente)** com regras rigorosas para garantir qualidade de código  
- 🎨 **Prettier** para padronização de formatação  
- 🔐 **Zod** para validação de schemas e variáveis de ambiente  
- ♻️ **Commitlint + Husky + Lint-Staged** para validação de commits e manutenção de qualidade no pipeline  
- 🐳 **Docker** (para ambiente isolado e pipelines)  
- ⚙️ **Vitest / Jest** (Testes Unitários e de Integração)  
- 📦 **Gerenciamento de Dependências otimizado com pnpm ou npm**  

---

## 🔥 Padrões e Melhores Práticas Aplicadas

- ✅ Clean Code  
- ✅ SOLID Principles  
- ✅ DRY (Don't Repeat Yourself)  
- ✅ KISS (Keep It Simple, Stupid)  
- ✅ YAGNI (You Aren't Gonna Need It)  
- ✅ Linting rigoroso com ESLint + Plugins modernos (`import-x`, `@typescript-eslint`, etc.)  
- ✅ Validação estrita de variáveis de ambiente centralizadas (proibido acesso direto a `process.env` fora de `./src/config/envs`)  
- ✅ Organização escalável por feature e domínio  
- ✅ Versionamento semântico e convenção de commits  
- ✅ Pipelines CI/CD preparadas para ambientes de staging e produção  

---

## ⚙️ Diferenciais Técnicos

- 🔥 Código altamente modular, desacoplado e de fácil manutenção  
- 🔥 Extensível para múltiplos canais (REST, GraphQL, Worker, etc.)  
- 🔥 Preparado para alta escalabilidade horizontal  
- 🔥 Cobertura de testes robusta e fácil de expandir  

---

## 📄 Organização de Código (Exemplo)

src/
├── application/
│ ├── use-cases/
│ └── services/
├── domain/
│ ├── entities/
│ ├── repositories/
│ └── value-objects/
├── infrastructure/
│ ├── database/
│ ├── providers/
│ └── external-apis/
├── interfaces/
│ ├── http/
│ └── cli/
├── config/
│ └── envs/
├── shared/
│ └── utils/




---

## 📚 Próximos passos

- 🔜 Integração com sistema de emissão de notas fiscais  
- 🔜 Implementação de sistema de relatórios e dashboards gerenciais  
- 🔜 Deploy com pipelines otimizadas para AWS / Railway / Render  

---

## 🏆 Objetivo final

Criar uma API profissional de nível enterprise, com qualidade de software comparável aos maiores players do mercado, e que permita a expansão futura do negócio de forma simples, segura e escalável.

---

## 🚀 Pronto para produção, pronto para escalar!
