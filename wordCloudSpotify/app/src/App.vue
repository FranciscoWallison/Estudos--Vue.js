<script setup>
import WordCloudCanvas from './components/WordCloudCanvas.vue'
</script>

<template>
  <header>
    <h1>Word Cloud Spotify</h1>
    <p>O que as músicas brasileiras mais tocadas mais falam?</p>
  </header>
  <main>
    <WordCloudCanvas />
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
</style>
