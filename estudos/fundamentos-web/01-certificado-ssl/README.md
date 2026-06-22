# 01 — Certificado SSL / TLS / HTTPS

## O que é?

Um **certificado SSL** é um **documento digital de identidade** de um site. Ele prova duas coisas:

1. Que o site é **mesmo quem diz ser** (você está no banco de verdade, não num clone).
2. Que a conversa entre você e o site está **criptografada** (ninguém no meio consegue ler/roubar seus dados).

É o que faz aparecer o **cadeado 🔒** e o `https://` na barra do navegador.

> **Analogia:** o certificado é como o **RG ou passaporte** do site. Qualquer um pode imprimir um papel dizendo "sou o Banco X". O que dá valor ao seu RG é ele ter sido **emitido por uma autoridade confiável** (o governo). Na web, essa "autoridade" é uma **CA (Autoridade Certificadora)**, em quem o seu navegador já confia de fábrica.

## "SSL" ou "TLS"? (importante para não te confундir)

Você vai ouvir os dois nomes. Na prática:

- **SSL** é o nome **antigo**. Todas as versões dele estão **obsoletas e inseguras** desde 2015.
- **TLS** é o protocolo **de verdade** usado hoje (versões TLS 1.2 e 1.3).

Mas, por costume, **todo mundo — inclusive profissionais — ainda diz "certificado SSL"**. Então: a gente fala "SSL", mas a tecnologia que roda por baixo é **TLS**. Não se preocupe com a sigla; preocupe-se com o conceito.

## O que o certificado realmente garante (as 3 coisas)

Esse é o ponto que mais gera confusão. São **três garantias diferentes**:

| Garantia | O que significa | Analogia |
|----------|-----------------|----------|
| 🔒 **Criptografia** (confidencialidade) | Ninguém no caminho consegue **ler** o que trafega | Conversar dentro de um túnel fechado |
| 🪪 **Autenticação** | Você tem certeza de que fala com o **site certo** | Conferir o RG da pessoa antes de confiar |
| ✅ **Integridade** | Ninguém **alterou** os dados no meio do caminho | Lacre de segurança que mostra se foi violado |

> 💡 **Sacada que confunde quase todo mundo:** criptografia **não é** o mesmo que autenticação. Dá pra ter uma conexão criptografada **com a pessoa errada** (é o caso do certificado autoassinado, mais abaixo). O papel central do certificado é a **autenticação** — provar a identidade.

## O que tem dentro de um certificado

| Campo | O que é | Exemplo real (do `badssl.com`) |
|-------|---------|-------------------------------|
| **Subject (CN)** | Para qual domínio foi emitido | `*.badssl.com` |
| **Issuer (CA)** | Quem emitiu (a autoridade) | `Let's Encrypt` |
| **Valid from** | A partir de quando vale | `May 26 2026` |
| **Valid to** | Até quando vale (a **expiração**) | `Aug 24 2026` |
| **Chave pública** | Usada para iniciar a criptografia | (um número enorme) |
| **Assinatura digital** | A "firma" da CA que prova que é autêntico | (um número enorme) |

## Como funciona (o "handshake" TLS, simplificado)

Quando você abre `https://site.com`, em milissegundos acontece:

```
1. Seu navegador:  "Oi, quero falar de forma segura. Me mostra seu certificado."
2. O servidor:     envia o certificado SSL dele.
3. Seu navegador confere 3 coisas:
      ✅ A CA que assinou é confiável? (está na minha lista de confiança?)
      ✅ O certificado NÃO está expirado? (data de hoje está dentro da validade?)
      ✅ O domínio do certificado bate com o site que pedi?
4. Se tudo OK -> combinam uma chave secreta e a conversa vira criptografada. 🔒
   Se algo falhar -> o navegador mostra o aviso vermelho de "site não seguro". ⛔
```

> O passo 3 é o coração de tudo. Repare que **"não está expirado"** é uma das verificações obrigatórias — é por isso que um certificado vencido **derruba o acesso**.

## Quem emite: as CAs e a cadeia de confiança

Seu navegador não confia diretamente no certificado de cada site. Ele confia numa **cadeia**:

```
FOLHA (o site)  ->  INTERMEDIÁRIO  ->  RAIZ (uma CA que o navegador já conhece)
*.google.com    ->  WR2            ->  GTS Root R1
```

O navegador já vem de fábrica com uma lista de **CAs raiz** confiáveis. Se a escada do certificado do site sobe até uma dessas raízes, ele confia. Se não sobe (ou a raiz é desconhecida), ele **avisa** — é o erro "raiz não confiável".

## Por que expira? (a dor do seu amigo)

**Todo certificado tem prazo de validade** e precisa ser **renovado** antes de vencer. Por quê?

- Se uma chave for roubada, um prazo curto **limita o estrago**.
- Força a manter os dados de identidade **atualizados**.

Números atuais (2026):

- **Let's Encrypt** (a CA gratuita mais usada): **90 dias**. A renovação costuma ser **automática** (você configura uma vez e esquece).
- **Prazo máximo permitido** está **encolhendo** por decisão do setor (CA/Browser Forum): de **398 dias** caindo para **200 dias (mar/2026)** → **100 (2027)** → **47 dias (2029)**.

> 🎯 **A lição:** com prazos cada vez mais curtos, **renovar na mão é receita para desastre**. A automação (auto-renovação) deixou de ser luxo e virou obrigação. O problema que "quebrou o sistema" do seu amigo foi quase certamente **uma renovação que não aconteceu** — manual e esquecida, ou uma automação que falhou silenciosamente.

## O que acontece quando expira

No instante em que a data passa do `valid_to`, o navegador **bloqueia o acesso** com um aviso assustador:

| Navegador | Código do erro | Mensagem que o usuário vê |
|-----------|---------------|---------------------------|
| Chrome / Edge | `NET::ERR_CERT_DATE_INVALID` | "Sua conexão não é particular" |
| Firefox | `SEC_ERROR_EXPIRED_CERTIFICATE` | "Aviso: possível risco de segurança à frente" |

Do ponto de vista do usuário, **o site simplesmente parou de funcionar** e parece inseguro/golpe. Em produção, isso significa: clientes não conseguem entrar, pagamentos falham, APIs entre sistemas param. Foi exatamente o que aconteceu no trabalho do seu amigo.

> ⚠️ **Pegadinha útil:** o mesmo erro `NET::ERR_CERT_DATE_INVALID` aparece se o **relógio do computador do usuário** estiver errado — porque o navegador compara a validade com a **hora local da máquina**. Então nem sempre a culpa é do servidor.

## Erros comuns (e o que cada um significa)

Testando com os sites de propósito do `badssl.com`, cada problema gera um código diferente (você vai ver isso nos desafios):

| Problema | Site de teste | Código no Node (`authorizationError`) |
|----------|---------------|----------------------------------------|
| **Expirado** | `expired.badssl.com` | `CERT_HAS_EXPIRED` |
| **Autoassinado** (sem CA) | `self-signed.badssl.com` | `DEPTH_ZERO_SELF_SIGNED_CERT` |
| **Raiz não confiável** | `untrusted-root.badssl.com` | `SELF_SIGNED_CERT_IN_CHAIN` |
| **Domínio errado** | `wrong.host.badssl.com` | `ERR_TLS_CERT_ALTNAME_INVALID` |

### Por que um certificado autoassinado AINDA criptografa, mas o navegador avisa?

Um certificado **autoassinado** é aquele que o próprio site emitiu para si mesmo (sem uma CA confiável por trás). A conexão até fica **criptografada** (confidencialidade OK!), mas falta a **autenticação**: ninguém de confiança garante que aquele servidor é mesmo quem diz ser. Você tem o túnel seguro... **mas possivelmente com a pessoa errada**. Por isso o navegador avisa.

## Onde isso aparece no seu dia a dia (e no Vue)

- **APIs precisam ser HTTPS:** seu app Vue em `https://` não consegue chamar uma API em `http://` — o navegador bloqueia ("mixed content"). O `baseURL` do axios precisa ser `https://`.
- **Deploy:** ao publicar na **Vercel** ou **Netlify**, elas provisionam um certificado **Let's Encrypt automático** pra você — por isso seu site já nasce com 🔒.
- **Desenvolvimento local:** às vezes você precisa rodar o Vite com HTTPS (`vite --https`) usando um certificado local autoassinado — e aí vê o aviso do navegador (agora você entende por quê!).
- **Depuração:** quando uma chamada falha com erro de certificado, você vai saber olhar a validade, a CA e o domínio — em vez de só "não funciona".

## Próximos passos

- Responda o [questionário](perguntas-respostas.md).
- Faça os [desafios](desafios.md) — é aqui que você **roda e vê** o certificado expirado de verdade.
- Quer a versão "sem jargão" pra explicar pra alguém? Veja o [resumo simples](resumo-simples.md).
