# Fundamentos da Web

Categoria dedicada a **como a web funciona por baixo** — protocolos, segurança e rede. São coisas que você usa todo dia (HTTPS, o cadeado 🔒, APIs) mas raramente para pra entender. Dominar isto te deixa muito mais confiante para depurar problemas reais de produção.

> Não é sobre Vue. É sobre o terreno onde todo app web roda. Quando algo "quebra em produção", muitas vezes é aqui.

## Tópicos

| # | Tema | O que você vai dominar | Pasta |
|---|------|------------------------|-------|
| 01 | **Certificado SSL / TLS** | O que é o cadeado 🔒, pra que serve, por que expira e como **validar na prática** | [01-certificado-ssl/](01-certificado-ssl/) |

> Mais temas virão (HTTP vs HTTPS, status codes, CORS, cookies, cabeçalhos). Esta categoria cresce conforme as dúvidas aparecem.

## Como estudar cada tema

Cada pasta tem os arquivos, na ordem:

1. **`README.md`** — a explicação (teoria com analogias).
2. **`perguntas-respostas.md`** — o questionário. Responda **antes** de abrir a resposta.
3. **`desafios.md`** — a parte prática: você **roda comandos e vê acontecendo**.
4. **`exemplos/`** — scripts prontos para rodar (quando o tema tiver).

## Regras de ouro

- **Veja acontecendo**: aqui a gente não decora — a gente conecta num servidor de verdade e observa.
- **Quebre de propósito**: existem sites feitos para ter certificado expirado/inválido. Use-os para ver o erro real.
- **Conecte ao seu dia a dia**: cada explicação termina com "Onde isso aparece no seu dia a dia (e no Vue)".
