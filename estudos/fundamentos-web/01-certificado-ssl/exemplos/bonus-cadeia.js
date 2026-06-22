// bonus-cadeia.js
//
// =====================================================================
//  BÔNUS: CAMINHANDO PELA CADEIA DE CONFIANÇA
// =====================================================================
//
//  COMO RODAR:
//     node bonus-cadeia.js google.com
//
//  Um certificado quase nunca vem sozinho. Ele faz parte de uma CADEIA:
//
//     FOLHA (o site)  ->  INTERMEDIÁRIO(S)  ->  RAIZ (a CA confiável)
//
//  O navegador só confia na FOLHA porque consegue subir essa escada até
//  uma RAIZ que ele já conhece de fábrica. Este script desenha essa escada.
// ---------------------------------------------------------------------

const tls = require('tls');
const host = process.argv[2] || 'badssl.com';

const socket = tls.connect(
  443,
  host,
  { servername: host, rejectUnauthorized: false },
  () => {
    // getPeerCertificate(true) -> o 'true' pede a CADEIA inteira, não só a folha.
    let cert = socket.getPeerCertificate(true);
    let nivel = 0;

    // A RAIZ aponta para SI MESMA (issuerCertificate === ela mesma).
    // Sem esse controle de "vistos", o while entraria em LOOP INFINITO na raiz.
    const vistos = new Set();

    console.log(`\n🔗 Cadeia de confiança de ${host}:\n`);

    while (cert && cert.fingerprint && !vistos.has(cert.fingerprint)) {
      vistos.add(cert.fingerprint);

      const rotulo = nivel === 0 ? 'FOLHA (o site)' : `nível ${nivel}`;
      console.log(`  [${rotulo}]`);
      console.log(`     subject: ${cert.subject && cert.subject.CN}`);
      console.log(`     issuer : ${cert.issuer && cert.issuer.CN}\n`);

      cert = cert.issuerCertificate; // sobe um degrau na escada
      nivel++;
    }

    socket.end();
  }
);

socket.on('error', (e) => console.log('❌ Erro:', e.message));
