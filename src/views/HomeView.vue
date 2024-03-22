<script setup>
import TheWelcome from '../components/Home/Welcome.vue'
import Carousel from '../components/Carousel.vue'
import Title from '../components/Title.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Chat from '../components/Chat/Chat.vue'

const viteRef = 'https://vitejs.dev/'
const vueRef = 'https://vuejs.org/'
</script>

<template>
  <Header />
  <main>
    <TheWelcome />
    <Title v-html="$t('Trending', { viteRef: viteRef, vueRef: vueRef })" />
    <Carousel type="trending" />
    <Title v-html="$t('Listed', { viteRef: viteRef, vueRef: vueRef })" />
    <Carousel type="newest" />
  </main>
  <Chat />
  <Footer />
</template>
