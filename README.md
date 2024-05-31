# React + TypeScript + Vite + Express

Пример приложения в связке React + Express.
В качестве пакетного менеджера используется pnpm. При использовании ноды с поддержкой
corepack pnpm установится автоматически

## Development

```bash
corepack enable
pnpm i
npm run dev
```

По умолчанию дев сервер запустится на [http://localhost:3000
](http://localhost:3000)

## Production

```bash
npm run build
NODE_ENV=production node dist/index.js
```
