# Exemplos — Inspetor de Certificado SSL/TLS

Scripts em **Node.js puro** (sem `npm install` — usam só o módulo nativo `tls`) para inspecionar o certificado de qualquer site.

## Arquivos

| Arquivo | O que faz | Como rodar |
|---------|-----------|-----------|
| [verificar-certificado.js](verificar-certificado.js) | Mostra dono, CA, validade, dias restantes e o veredito do Node | `node verificar-certificado.js <host>` |
| [bonus-cadeia.js](bonus-cadeia.js) | Desenha a cadeia de confiança (folha → intermediário → raiz) | `node bonus-cadeia.js <host>` |

> Se você não passar um host, o padrão é `badssl.com` (que tem certificado válido).

## Pré-requisitos

- **Node.js** instalado (`node --version`). Qualquer versão recente serve.
- Conexão com a internet (os scripts conectam em sites reais na porta 443).

## Sites de teste (badssl.com)

O [badssl.com](https://badssl.com) mantém subdomínios com certificados **quebrados de propósito** — perfeitos para aprender:

| Host | Situação |
|------|----------|
| `badssl.com` / `sha256.badssl.com` | ✅ válido |
| `expired.badssl.com` | ❌ expirado |
| `self-signed.badssl.com` | ❌ autoassinado |
| `untrusted-root.badssl.com` | ❌ raiz não confiável |
| `wrong.host.badssl.com` | ❌ domínio não bate |

## Saída esperada

### Certificado válido
```
$ node verificar-certificado.js badssl.com

🔎 Inspecionando o certificado de: badssl.com

📄 EMITIDO PARA (subject):
   CN  (domínio): *.badssl.com

🏛️  EMITIDO POR (issuer / a Autoridade Certificadora):
   O   (organização): Let's Encrypt
   CN  (nome da CA):   R13

📅 VALIDADE:
   Válido a partir de (valid_from): May 26 20:02:50 2026 GMT
   Válido até          (valid_to): Aug 24 20:02:49 2026 GMT

⏳ SITUAÇÃO DA VALIDADE:
   ✅ Válido por mais 63 dia(s).

🔐 VALIDAÇÃO DO NODE:
   socket.authorized: true
   ✅ O Node considerou este certificado CONFIÁVEL.
```

### Certificado EXPIRADO
```
$ node verificar-certificado.js expired.badssl.com
...
📅 VALIDADE:
   Válido a partir de (valid_from): Apr  9 00:00:00 2015 GMT
   Válido até          (valid_to): Apr 12 23:59:59 2015 GMT

⏳ SITUAÇÃO DA VALIDADE:
   ❌ EXPIRADO há 4089 dia(s).

🔐 VALIDAÇÃO DO NODE:
   socket.authorized: false
   ⚠️  Motivo da reprovação (authorizationError): CERT_HAS_EXPIRED
```

### Cadeia de confiança
```
$ node bonus-cadeia.js google.com

🔗 Cadeia de confiança de google.com:

  [FOLHA (o site)]
     subject: *.google.com
     issuer : WR2

  [nível 1]
     subject: WR2
     issuer : GTS Root R1

  [nível 2]
     subject: GTS Root R1
     issuer : GlobalSign Root CA
```

## ⚠️ Nota de segurança

Os scripts usam `rejectUnauthorized: false` **de propósito**, para conseguir inspecionar até certificados inválidos. Isso é uma **ferramenta de diagnóstico** — **nunca** desligue a validação de certificado num app real que trafega dados de verdade. Sem validação, você tem criptografia mas **não** tem garantia de identidade (risco de ataque "man-in-the-middle").
