# word-cloud

App Vue 3 + Vite que gera uma nuvem de palavras com as letras das músicas mais tocadas no Brasil.

## Setup

```
npm install
```

## Desenvolvimento (hot-reload)

```
npm run dev
```

Abre em `http://localhost:3333`.

> **Sobre o proxy / CORS:** as APIs externas (iTunes, Vagalume, lyrics.ovh) bloqueiam
> chamadas diretas do browser. O `vite.config.js` define um **proxy de desenvolvimento**
> (`/api/itunes`, `/api/vagalume`, `/api/lyrics`) que repassa as requisições e contorna o CORS.
> Esse proxy só existe em `npm run dev`.

## Build de produção

```
npm run build
npm run preview
```

> **Limitação em produção:** o proxy de dev não existe no build estático. O ranking
> (iTunes RSS) permite CORS, mas as APIs de letras podem não permitir — um deploy real
> precisaria de um pequeno backend/serverless para intermediar as chamadas de letra.

## Lint

```
npm run lint
```

## Fontes de dados

- **Ranking:** iTunes RSS — `https://itunes.apple.com/br/rss/topsongs/limit=25/json` (sem auth).
- **Letras:** Vagalume (principal) com fallback para lyrics.ovh (sem key). Músicas sem
  letra são ignoradas sem quebrar a geração da nuvem.
