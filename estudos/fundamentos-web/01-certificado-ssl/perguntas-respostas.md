# 01 — Certificado SSL / TLS — Perguntas e Respostas

> Tente responder com suas palavras **antes** de abrir cada resposta.

---

### 1. Em uma frase, o que é um certificado SSL?

<details>
<summary>Resposta</summary>

É o **documento de identidade digital** de um site: prova que ele é mesmo quem diz ser e permite uma conexão **criptografada**. É o que ativa o cadeado 🔒 e o `https://`.
</details>

---

### 2. Qual a diferença entre "SSL" e "TLS"?

<details>
<summary>Resposta</summary>

- **SSL** é o nome antigo do protocolo — todas as versões estão **obsoletas/inseguras** desde 2015.
- **TLS** é o protocolo **atual** de verdade (1.2 e 1.3).

Mas, por costume, todo mundo ainda diz "certificado SSL" mesmo usando TLS por baixo.
</details>

---

### 3. Quais são as 3 garantias que o HTTPS oferece?

<details>
<summary>Resposta</summary>

1. **Criptografia (confidencialidade):** ninguém no meio consegue ler os dados.
2. **Autenticação:** você tem certeza de que está falando com o site certo.
3. **Integridade:** ninguém alterou os dados no caminho.

O papel central do **certificado** é a **autenticação**.
</details>

---

### 4. Criptografia e autenticação são a mesma coisa?

<details>
<summary>Resposta</summary>

**Não!** São garantias diferentes. É possível ter uma conexão **criptografada com a pessoa errada** — é exatamente o caso de um certificado **autoassinado**: o túnel é seguro, mas ninguém confiável garante a identidade de quem está do outro lado.
</details>

---

### 5. O que é uma CA (Autoridade Certificadora)?

<details>
<summary>Resposta</summary>

É a entidade confiável que **emite e assina** certificados, atestando a identidade do site — como um "cartório" da internet. Exemplos: **Let's Encrypt**, DigiCert. Seu navegador já vem de fábrica com uma lista de **CAs raiz** em quem confia.
</details>

---

### 6. O que é a "cadeia de confiança"?

<details>
<summary>Resposta</summary>

É a escada que vai do certificado do site até uma CA raiz confiável:

```
FOLHA (o site) -> INTERMEDIÁRIO -> RAIZ (conhecida pelo navegador)
```

O navegador confia na folha porque consegue **subir** essa escada até uma raiz que ele já conhece. Se não consegue, mostra erro de "raiz não confiável".
</details>

---

### 7. Por que certificados expiram?

<details>
<summary>Resposta</summary>

Por **segurança**: um prazo de validade limita o estrago caso uma chave seja roubada e força a manter os dados atualizados. Por isso precisam ser **renovados** periodicamente. O Let's Encrypt dura **90 dias**, e o prazo máximo do setor está caindo (rumo a **47 dias em 2029**) — o que torna a **auto-renovação** praticamente obrigatória.
</details>

---

### 8. O que acontece, na prática, quando um certificado expira?

<details>
<summary>Resposta</summary>

O navegador **bloqueia o acesso** com um aviso de segurança:
- Chrome/Edge: `NET::ERR_CERT_DATE_INVALID` ("Sua conexão não é particular").
- Firefox: `SEC_ERROR_EXPIRED_CERTIFICATE`.

Para o usuário, o site "parou de funcionar" e parece inseguro. Em produção: logins falham, pagamentos param, integrações quebram.
</details>

---

### 9. O erro de "certificado expirado" é sempre culpa do servidor?

<details>
<summary>Resposta</summary>

**Não.** O **relógio errado** na máquina do usuário dispara o mesmo `NET::ERR_CERT_DATE_INVALID`, porque o navegador compara a validade com a **hora local**. Se o site funciona para todo mundo menos para uma pessoa, suspeite do relógio dela.
</details>

---

### 10. No script de validação, por que usamos `rejectUnauthorized: false`?

<details>
<summary>Resposta</summary>

Porque, por padrão, o Node **derruba a conexão com erro** antes de te deixar ler um certificado inválido. Como queremos **inspecionar certificados ruins** (expirados, autoassinados) para aprender, desligamos essa rejeição automática e fazemos a checagem nós mesmos.

⚠️ **Mas isso é só para diagnóstico.** Nunca use em produção: conectar sem validar te dá criptografia **sem** autenticação, abrindo porta para ataque "man-in-the-middle".
</details>

---

### 11. O que significa `socket.authorizationError === 'CERT_HAS_EXPIRED'`?

<details>
<summary>Resposta</summary>

É o **motivo exato** pelo qual o Node reprovou o certificado: ele venceu (passou da data `valid_to`). Outros códigos comuns: `DEPTH_ZERO_SELF_SIGNED_CERT` (autoassinado), `SELF_SIGNED_CERT_IN_CHAIN` (raiz não confiável), `ERR_TLS_CERT_ALTNAME_INVALID` (domínio não bate).
</details>

---

### 12. Quando você faz deploy na Vercel/Netlify, precisa comprar um certificado?

<details>
<summary>Resposta</summary>

**Não.** Essas plataformas provisionam um certificado **Let's Encrypt gratuito e automático** (e renovam sozinhas). Por isso seu site Vue já nasce com `https://` e cadeado 🔒 sem você fazer nada.
</details>

---

### 13. Por que um app Vue em `https://` não consegue chamar uma API em `http://`?

<details>
<summary>Resposta</summary>

Por causa do bloqueio de **"mixed content"** (conteúdo misto): o navegador proíbe uma página segura (HTTPS) de carregar recursos inseguros (HTTP), pois isso anularia a proteção. A solução é a API também ser **HTTPS** — por isso o `baseURL` do axios precisa começar com `https://`.
</details>
