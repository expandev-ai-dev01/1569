# TODO List App

Sistema de gerenciamento de tarefas

## Features

- Criação de Tarefas
- Categorização de Tarefas
- Definição de Prioridades
- Estabelecimento de Prazos
- Marcação de Conclusão
- Busca de Tarefas
- Notificações e Lembretes
- Compartilhamento de Tarefas
- Visualização em Calendário
- Sincronização Multiplataforma

## Tech Stack

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- TailwindCSS 3.4.14
- React Router 7.9.3
- TanStack Query 5.90.2
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Application configuration
│   ├── App.tsx         # Root component
│   └── router.tsx      # Routing configuration
├── assets/             # Static assets
│   └── styles/         # Global styles
├── core/               # Core functionality
│   ├── components/     # Shared components
│   ├── hooks/          # Shared hooks
│   ├── lib/            # Library configurations
│   ├── types/          # Global types
│   ├── utils/          # Utility functions
│   └── constants/      # Global constants
├── domain/             # Business domains
├── pages/              # Page components
│   └── layouts/        # Layout components
└── main.tsx            # Application entry point
```

## API Configuration

The application connects to a REST API backend with the following structure:

- Public endpoints: `/api/v1/external/...`
- Authenticated endpoints: `/api/v1/internal/...`

Configure the API URL in `.env` file.

## License

Private project