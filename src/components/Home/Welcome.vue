<script setup>
import { RouterLink } from 'vue-router'
import '../../assets/css/home/welcome.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { useUserStore } from '@/stores/UserStore.js'

const userStore = useUserStore()
</script>

<template>
  <div class="welcome">
    <div class="title">
      <h1>
        {{ $t('Info') }}
      </h1>
      <p v-if="!userStore.isLoggedIn">
        {{ $t('Create Account') }}
      </p>
      <p v-if="userStore.isLoggedIn">
        {{ $t('Welcome back') }} {{ userStore.username }}, {{ $t('Greeting') }}
      </p>
      <RouterLink to="/login" v-if="!userStore.isLoggedIn">
        <button class="register">
          {{ $t('Join') }}
        </button>
      </RouterLink>
    </div>
    <div class="background-fade"></div>
  </div>
</template>
