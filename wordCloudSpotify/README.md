# Word Cloud Spotify

## O que as músicas brasileiras mais tocadas mais falam?

![wordCloudSpotify](https://user-images.githubusercontent.com/19413241/202439286-7c7b009a-30fa-41a4-b455-58324eb9fb28.png)

Gera uma nuvem de palavras a partir das letras das músicas mais tocadas no Brasil.

## Como funciona

1. Busca o ranking de músicas no **iTunes RSS** (Brasil) — público, sem autenticação.
2. Coleta a letra de cada música: **Vagalume** como fonte principal e **lyrics.ovh** como fallback.
3. Limpa o texto (remove acentos, pontuação e *stopwords* PT-BR) e conta a frequência das palavras.
4. Renderiza a nuvem em um `<canvas>` com a biblioteca `wordcloud`.

## Ferramentas

- Vue 3 (Composition API, `<script setup>`)
- Vite
- axios
- wordcloud
- iTunes RSS (ranking) + Vagalume / lyrics.ovh (letras)

## Rodando

Veja [app/README.md](app/README.md) para os comandos.
