// verificar-certificado.js
//
// =====================================================================
//  INSPETOR DE CERTIFICADO SSL/TLS  —  Node.js puro (sem npm install)
// =====================================================================
//
//  COMO RODAR:
//     node verificar-certificado.js expired.badssl.com
//     node verificar-certificado.js self-signed.badssl.com
//     node verificar-certificado.js google.com
//
//  Se você não passar nenhum host, ele usa "badssl.com" (que tem cert VÁLIDO).
//
//  OBJETIVO DIDÁTICO: conectar numa porta 443 (HTTPS), PEGAR o certificado
//  que o servidor apresenta e EXPLICAR, em português, o que ele significa.
// ---------------------------------------------------------------------

// "tls" é um módulo NATIVO do Node (não precisa instalar nada).
// Ele cuida da camada TLS — o "S" do HTTPS.
const tls = require('tls');

// process.argv é o array de argumentos da linha de comando:
//   [0] = caminho do node, [1] = caminho do script, [2] = primeiro argumento NOSSO.
// Se [2] não existir, usamos "badssl.com" como padrão (tem cert válido).
const host = process.argv[2] || 'badssl.com';

console.log(`\n🔎 Inspecionando o certificado de: ${host}\n`);

// ---------------------------------------------------------------------
//  AS OPÇÕES DA CONEXÃO
// ---------------------------------------------------------------------
//
//  servername: host
//     -> Manda o SNI (Server Name Indication). Servidores modernos hospedam
//        VÁRIOS sites no mesmo IP; o SNI diz "quero o certificado DESTE domínio".
//        Sem ele, você pode receber o certificado errado (ou um genérico).
//
//  rejectUnauthorized: false   <<< O PONTO MAIS IMPORTANTE DESTE SCRIPT >>>
//     -> Por PADRÃO o Node REJEITA (dá erro) ANTES de te entregar o socket
//        se o certificado for inválido (expirado, autoassinado, etc.).
//        Isso é ótimo para PRODUÇÃO, mas PÉSSIMO para a nossa aula: a gente
//        QUER justamente inspecionar certificados RUINS para aprender com eles.
//
//        Colocando "false", dizemos: "não derrube a conexão por causa do
//        certificado — deixe eu CONECTAR e LER o certificado mesmo assim".
//        Depois, nós mesmos checamos se ele é válido.
//
//     ⚠️  AVISO DE SEGURANÇA:
//        rejectUnauthorized:false é uma FERRAMENTA DE DIAGNÓSTICO.
//        NUNCA use isso para transferir dados reais (login, pagamento, API
//        de produção). Desligar essa verificação é como aceitar um documento
//        sem conferir se é falso — abre a porta para ataque "man-in-the-middle".
//        Conectar SEM validar = você tem CRIPTOGRAFIA, mas NÃO tem AUTENTICAÇÃO.
const opcoes = {
  servername: host,
  rejectUnauthorized: false,
  timeout: 10000, // 10s de segurança: se o servidor não responder, desistimos.
};

const socket = tls.connect(443, host, opcoes, () => {
  // Este callback roda QUANDO o handshake TLS termina (conexão estabelecida).

  // getPeerCertificate() devolve um OBJETO com os dados do certificado do servidor.
  const cert = socket.getPeerCertificate();

  // Caso raro: alguns servidores podem retornar um objeto vazio {}.
  if (!cert || Object.keys(cert).length === 0) {
    console.log('❌ Nenhum certificado foi retornado pelo servidor.');
    socket.end();
    return;
  }

  // -------------------------------------------------------------------
  //  QUEM É O DONO E QUEM EMITIU
  // -------------------------------------------------------------------
  // cert.subject = PARA QUEM o certificado foi emitido (o "dono" / o site).
  //   .CN = Common Name (geralmente o domínio, ex: "*.badssl.com").
  // cert.issuer  = QUEM emitiu (a Autoridade Certificadora / CA).
  //   .O = Organization (ex: "Let's Encrypt"), .CN = nome da CA.
  console.log('📄 EMITIDO PARA (subject):');
  console.log('   CN  (domínio):', cert.subject && cert.subject.CN);
  console.log('\n🏛️  EMITIDO POR (issuer / a Autoridade Certificadora):');
  console.log('   O   (organização):', cert.issuer && cert.issuer.O);
  console.log('   CN  (nome da CA):  ', cert.issuer && cert.issuer.CN);

  // -------------------------------------------------------------------
  //  DATAS DE VALIDADE
  // -------------------------------------------------------------------
  // valid_from / valid_to vêm como STRINGS no formato:
  //   "Apr 10 12:00:00 2026 GMT"
  // O "GMT" no final é UTC — o JavaScript entende isso nativamente.
  console.log('\n📅 VALIDADE:');
  console.log('   Válido a partir de (valid_from):', cert.valid_from);
  console.log('   Válido até          (valid_to):', cert.valid_to);

  // Convertendo a string de expiração em um objeto Date de verdade.
  const dataExpiracao = new Date(cert.valid_to);
  const agora = new Date();

  // Diferença em milissegundos -> convertemos para DIAS.
  const msPorDia = 1000 * 60 * 60 * 24;
  const diasRestantes = Math.floor((dataExpiracao - agora) / msPorDia);

  console.log('\n⏳ SITUAÇÃO DA VALIDADE:');
  if (diasRestantes >= 0) {
    console.log(`   ✅ Válido por mais ${diasRestantes} dia(s).`);
  } else {
    console.log(`   ❌ EXPIRADO há ${Math.abs(diasRestantes)} dia(s).`);
  }

  // -------------------------------------------------------------------
  //  O VEREDITO DO PRÓPRIO NODE
  // -------------------------------------------------------------------
  // socket.authorized = true/false: o certificado PASSOU na validação?
  //   (lembre: nós desligamos a rejeição automática, mas o Node AINDA nos
  //    conta, neste booleano, se ele TERIA aprovado ou não.)
  // socket.authorizationError = se reprovou, AQUI vem o MOTIVO EXATO, ex:
  //   CERT_HAS_EXPIRED, SELF_SIGNED_CERT_IN_CHAIN, ERR_TLS_CERT_ALTNAME_INVALID.
  console.log('\n🔐 VALIDAÇÃO DO NODE:');
  console.log('   socket.authorized:', socket.authorized);
  if (!socket.authorized) {
    console.log('   ⚠️  Motivo da reprovação (authorizationError):',
                socket.authorizationError);
  } else {
    console.log('   ✅ O Node considerou este certificado CONFIÁVEL.');
  }

  console.log(''); // linha em branco final
  socket.end(); // encerra a conexão educadamente.
});

// ---------------------------------------------------------------------
//  TRATAMENTO DE ERROS (sempre trate o evento 'error'!)
// ---------------------------------------------------------------------
// Se o host não existir, a rede cair, ou a porta estiver fechada, o socket
// emite 'error'. Sem este handler, o Node DERRUBA o programa com uma exceção.
socket.on('error', (err) => {
  console.log('❌ Erro de conexão:', err.message);
});

// Se estourar o timeout (servidor mudo), avisamos e fechamos.
socket.on('timeout', () => {
  console.log('❌ Tempo esgotado: o servidor não respondeu a tempo.');
  socket.destroy();
});
