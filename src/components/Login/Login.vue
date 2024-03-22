<script setup>
import { RouterLink } from 'vue-router'
import '../../assets/css/login/login.css'
import { useUserStore } from '@/stores/UserStore.js'
const userStore = useUserStore()
</script>

<script>
const userStore = useUserStore()

export default {
  data() {
    return {
      error: '',
      username: null,
      password: null
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await userStore.logUserIn(this.username, this.password)
      } catch (error) {
        this.error = "Username or password is incorrect"
      }
    }
  }
}
</script>

<template>
  <div class="loginContainer">
    <RouterLink to="/" class="logo-container">
      <img src="@/assets/img/logo.png" alt="logo" />
      <h1>tokenly</h1>
    </RouterLink>
    <div class="login">
      <form @submit.prevent="handleSubmit()">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button type="submit">Login</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
      <p>
        {{ $t('Not registered?') }}
        <RouterLink to="/signup"> {{ $t('Sign up') }} </RouterLink>
      </p>
    </div>
  </div>
</template>
