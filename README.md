# Smilbot Frontend

SPA en React + TypeScript que consume el backend de Smilbot. Las reglas del proyecto están en [AGENTS.md](AGENTS.md) y los contratos de la API en la bóveda (`../smilbot-vault`).

## Puesta en marcha

```bash
cp .env.example .env   # ajusta VITE_API_URL
npm install
npm run dev            # http://localhost:5173 (debe coincidir con FRONTEND_URL del backend)
```

## Scripts

| Script              | Qué hace                        |
| :------------------ | :------------------------------ |
| `npm run dev`       | Servidor de desarrollo          |
| `npm run build`     | Typecheck + build de producción |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | `tsc -b`                        |
| `npm run test`      | Vitest (API mockeada con MSW)   |
| `npm run format`    | Prettier                        |
