# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

4. Build para produção:
```bash
npm run build
npm start
```

## Endpoints da API

### Health Check
- `GET /health` - Verifica status da API

### API v1
Base URL: `/api/v1`

#### External (Público)
- Endpoints públicos serão adicionados conforme features são implementadas

#### Internal (Autenticado)
- Endpoints autenticados serão adicionados conforme features são implementadas

## Desenvolvimento

### Padrões de Código
- TypeScript strict mode
- Indentação: 2 espaços
- Aspas simples para strings
- Semicolons obrigatórios
- Máximo 120 caracteres por linha

### Estrutura de Módulos
Cada módulo de negócio segue a estrutura:
```
services/[module]/
├── [module]Rules.ts      # Lógica de negócio
├── [module]Types.ts      # Definições de tipos
└── index.ts              # Exports
```

## Licença

ISC