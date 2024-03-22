<script setup>
import { RouterLink } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Publish from '../components/Publish.vue'
import Title from '../components/Title.vue'
import Chat from '../components/Chat/Chat.vue'
</script>

<template>
  <Header />
  <main>
    <Publish />
  </main>
  <Chat />
  <Footer />
</template>
