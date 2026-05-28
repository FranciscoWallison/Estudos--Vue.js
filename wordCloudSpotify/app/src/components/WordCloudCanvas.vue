<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import WordCloud from 'wordcloud'

// Quantas músicas do topo buscar.
const TOP_N = 25

// Stopwords: sem isso a nuvem fica dominada por palavras vazias.
// O ranking do iTunes BR mistura músicas em português e inglês, então
// filtramos os dois idiomas.
const STOPWORDS = new Set([
  // PT-BR
  'a', 'o', 'e', 'de', 'da', 'do', 'das', 'dos', 'que', 'em', 'um', 'uma',
  'uns', 'umas', 'no', 'na', 'nos', 'nas', 'por', 'para', 'pra', 'pro', 'com',
  'sem', 'se', 'me', 'te', 'lhe', 'eu', 'tu', 'ele', 'ela', 'eles',
  'elas', 'voce', 'voces', 'nao', 'sim', 'meu', 'minha', 'seu', 'sua', 'teu',
  'tua', 'mais', 'mas', 'ja', 'la', 'ai', 'ate', 'so', 'como', 'quando',
  'tudo', 'todo', 'toda', 'isso', 'esse', 'essa', 'este', 'esta', 'aqui',
  'ao', 'aos', 'foi', 'ser', 'tem', 'vai', 'vou', 'ta', 'to', 'ou',
  'numa', 'num', 'pela', 'pelo', 'dele', 'dela', 'quem', 'qual', 'ne',
  // EN
  'the', 'you', 'and', 'your', 'out', 'but', 'for', 'are', 'was', 'will',
  'with', 'that', 'this', 'what', 'when', 'all', 'can', 'get', 'got', 'just',
  'like', 'dont', 'cant', 'wont', 'aint', 'yeah', 'ooh', 'gonna', 'wanna',
  'gotta', 'let', 'its', 'youre', 'theyre', 'been', 'have', 'has', 'had',
  'not', 'now', 'then', 'there', 'here', 'they', 'them', 'she', 'his', 'her',
  'him', 'who', 'why', 'how', 'too', 'did', 'does', 'off', 'our', 'oh',
  'yes', 'know', 'one', 'cause', 'from', 'about', 'into', 'every'
])

const canvasRef = ref(null)
const loading = ref(true)
const error = ref(null)
const status = ref('')

// 1. Top músicas do Brasil via iTunes RSS (público, sem auth).
async function fetchTopSongs() {
  const { data } = await axios.get(`/api/itunes/br/rss/topsongs/limit=${TOP_N}/json`)
  const entries = data?.feed?.entry ?? []
  return entries.map((entry) => ({
    artista: entry['im:artist']?.label ?? '',
    musica: entry['im:name']?.label ?? ''
  }))
}

// 2a. Letra via Vagalume (melhor cobertura BR).
async function fetchFromVagalume(artista, musica) {
  const url = `/api/vagalume/search.php?art=${encodeURIComponent(artista)}&mus=${encodeURIComponent(musica)}`
  const { data } = await axios.get(url)
  if (data?.type === 'notfound' || data?.type === 'notimplemented') return ''
  return data?.mus?.[0]?.text ?? ''
}

// 2b. Fallback: lyrics.ovh (sem key).
async function fetchFromLyricsOvh(artista, musica) {
  const url = `/api/lyrics/v1/${encodeURIComponent(artista)}/${encodeURIComponent(musica)}`
  const { data } = await axios.get(url)
  return data?.lyrics ?? ''
}

// Tenta Vagalume, cai para lyrics.ovh; nunca quebra o fluxo.
async function fetchLyrics(artista, musica) {
  try {
    const letra = await fetchFromVagalume(artista, musica)
    if (letra.trim()) return letra
  } catch {
    // segue para o fallback
  }
  try {
    return await fetchFromLyricsOvh(artista, musica)
  } catch {
    return ''
  }
}

// 3. Texto -> [[palavra, frequência], ...] já filtrado e ordenado.
function processText(texto) {
  const limpo = texto
    .normalize('NFD')
    .replace(/[^0-9a-zA-Z\s]/g, '') // remove acentos (separados pelo NFD), pontuação e símbolos
    .replace(/\s+/g, ' ')
    .toLowerCase()

  const freq = new Map()
  for (const palavra of limpo.split(' ')) {
    if (palavra.length < 3 || STOPWORDS.has(palavra)) continue
    freq.set(palavra, (freq.get(palavra) ?? 0) + 1)
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 120)
}

// 4. Desenha no canvas.
function render(list) {
  WordCloud(canvasRef.value, {
    list,
    gridSize: 8,
    weightFactor: (n) => Math.log2(n + 1) * 9,
    fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
    color: 'random-dark',
    backgroundColor: '#ffffff',
    rotateRatio: 0.3,
    minSize: 6
  })
}

onMounted(async () => {
  try {
    status.value = 'Buscando as músicas mais tocadas...'
    const songs = await fetchTopSongs()
    if (!songs.length) throw new Error('Nenhuma música retornada pela fonte de dados.')

    let texto = ''
    for (let i = 0; i < songs.length; i++) {
      const { artista, musica } = songs[i]
      status.value = `Buscando letras (${i + 1}/${songs.length}): ${musica}`
      texto += ' ' + (await fetchLyrics(artista, musica))
    }

    const list = processText(texto)
    if (!list.length) throw new Error('Não foi possível obter letras para gerar a nuvem.')

    render(list)
  } catch (e) {
    error.value = e.message ?? 'Erro inesperado.'
    console.error(e)
  } finally {
    loading.value = false
    status.value = ''
  }
})
</script>

<template>
  <div class="wordcloud">
    <p v-if="loading" class="state">{{ status || 'Carregando...' }}</p>
    <p v-else-if="error" class="state error">{{ error }}</p>
    <canvas
      v-show="!loading && !error"
      ref="canvasRef"
      class="canvas"
      width="600"
      height="600"
    ></canvas>
  </div>
</template>

<style scoped>
.wordcloud {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}
.canvas {
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
}
.state {
  color: #666;
  font-style: italic;
}
.state.error {
  color: #c0392b;
}
</style>
