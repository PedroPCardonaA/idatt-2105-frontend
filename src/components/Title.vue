<script setup>
import '../assets/css/title.css'

const props = defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>

<template>
  <h1 class="title_component">{{ title }}</h1>
</template>
