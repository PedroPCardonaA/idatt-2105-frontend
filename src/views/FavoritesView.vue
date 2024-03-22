<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Favorites from '../components/Favorites.vue'
import Chat from '../components/Chat/Chat.vue'
</script>

<template>
  <Header />
  <main class="favorites-view">
    <Favorites />
  </main>
  <Chat />
  <Footer />
</template>
