# 01 — Certificado SSL / TLS — Desafios

> A graça deste tema é **ver acontecendo**. Você vai conectar em sites reais — inclusive em sites com certificado **propositalmente expirado/quebrado** ([badssl.com](https://badssl.com)) — e observar o erro real.
>
> Os scripts ficam em [exemplos/](exemplos/). Abra o terminal **dentro** dessa pasta:
> ```bash
> cd exemplos
> ```

---

## Desafio 1.1 — O cadeado do navegador (sem código)
Abra qualquer site `https://` (ex.: `https://github.com`). Clique no **cadeado 🔒** ao lado da URL → "A conexão é segura" → "O certificado é válido".

**Responda (anote):**
- Para qual domínio o certificado foi emitido?
- Qual a **CA** (quem emitiu)?
- Qual a data de **validade** (valid to)?

---

## Desafio 1.2 — Inspecionar um certificado VÁLIDO (script Node)
Rode o script contra um site saudável:

```bash
node verificar-certificado.js google.com
```

**Critérios:** identifique na saída o `socket.authorized: true`, a CA e quantos dias faltam para expirar.

---

## Desafio 1.3 — Ver um certificado EXPIRADO de verdade 🎯
Este é o ponto central — o problema do mundo real:

```bash
node verificar-certificado.js expired.badssl.com
```

**O que observar:**
- `❌ EXPIRADO há N dia(s)` (vai ser um número enorme — esse cert venceu em 2015!).
- `socket.authorized: false`.
- `authorizationError: CERT_HAS_EXPIRED` ← **este é o código que explica o problema do seu amigo.**

---

## Desafio 1.4 — Comparar os tipos de erro
Rode o script contra cada site quebrado e **anote o `authorizationError` de cada um**:

```bash
node verificar-certificado.js self-signed.badssl.com
node verificar-certificado.js untrusted-root.badssl.com
node verificar-certificado.js wrong.host.badssl.com
```

**Critérios:** monte uma tabelinha relacionando o site → o código do erro. Esperado:

| Site | Código |
|------|--------|
| self-signed | `DEPTH_ZERO_SELF_SIGNED_CERT` |
| untrusted-root | `SELF_SIGNED_CERT_IN_CHAIN` |
| wrong.host | `ERR_TLS_CERT_ALTNAME_INVALID` |

> 💡 **Observação real:** o `wrong.host` às vezes derruba a conexão com `ECONNRESET` (o servidor fecha na sua cara) antes de chegar no erro de domínio. Se acontecer, **rode de novo** — costuma funcionar na segunda tentativa.

---

## Desafio 1.5 — Mesma coisa, com OpenSSL (linha de comando)
Profissionais usam o `openssl` para checar certificados rapidinho. **No Git Bash** (não no PowerShell), rode:

```bash
openssl s_client -connect expired.badssl.com:443 -servername expired.badssl.com </dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```

**O que você verá:**
```
notBefore=Apr  9 00:00:00 2015 GMT
notAfter=Apr 12 23:59:59 2015 GMT     <- repare: venceu em 2015!
subject=...CN=*.badssl.com
issuer=...O=COMODO CA Limited...
```

**Por que `</dev/null` e `2>/dev/null`?** O primeiro fecha a entrada (senão o comando trava esperando você digitar); o segundo joga fora o ruído do handshake, deixando só o que importa.

---

## Desafio 1.6 — Como o `curl` reage a um certificado expirado
O `curl` é a ferramenta universal de requisições. Veja-o **recusar** uma conexão insegura:

```bash
curl -I https://expired.badssl.com
```

**No Windows**, a mensagem virá assim (o curl usa o "Schannel", o TLS nativo do Windows):
```
curl: (35) schannel: ... SEC_E_CERT_EXPIRED ... O certificado recebido expirou.
```
> (No Linux/Mac, a mensagem é `curl: (60) SSL certificate problem: certificate has expired`. Conteúdo igual, texto diferente.)

Agora force o curl a **ignorar** o erro com `-k` (de _insecure_):

```bash
curl -kI https://expired.badssl.com
```

Agora retorna `HTTP/1.1 200 OK`. 

**Reflexão (anote):** o `-k` é o equivalente, na linha de comando, do `rejectUnauthorized: false` do nosso script. Em que situação usar `-k` é aceitável? E por que **nunca** em produção?

---

## Desafio 1.7 — Transforme o script num MONITOR de expiração 🔥
Este é o desafio que **teria evitado o problema do seu amigo**.

Copie `verificar-certificado.js` e modifique para que, além de tudo, ele **avise com antecedência**:

- Se faltam **menos de 30 dias** para expirar → imprimir um alerta amarelo:
  `⚠️ ATENÇÃO: expira em breve! Renove já.`
- Se já expirou → o `❌ EXPIRADO` que já existe.
- Caso contrário → o `✅` normal.

```bash
# Teste a lógica de "expira em breve" contra um cert válido com poucos dias.
# Dica: o badssl.com costuma ter ~60-90 dias; ajuste o limite para 90 só para ver o alerta disparar.
node meu-monitor.js badssl.com
```

**Critérios:**
- Use a variável `diasRestantes` que já existe no script.
- Três caminhos claros (expirado / expira em breve / ok) — bom momento para revisar **operadores lógicos** e **controle de fluxo** (`if/else if/else`).

---

## Bônus — Desenhe a cadeia de confiança
Rode a variante que sobe a escada folha → intermediário → raiz:

```bash
node bonus-cadeia.js google.com
```

**Tarefa:** desenhe num papel a cadeia que apareceu (ex.: `*.google.com → WR2 → GTS Root R1`). Depois rode contra `github.com` e compare: a CA é a mesma? Quantos níveis tem?
