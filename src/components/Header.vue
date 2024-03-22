<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import '../assets/css/header.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { useUserStore } from '@/stores/UserStore.js'
import { onMounted } from 'vue'

const userStore = useUserStore()
const displayMenu = ref(null)

onMounted(() => {
  // Make the background fade in on scroll
  window.addEventListener('scroll', () => {
    // If the screen is too small, don't do anything
    if (window.innerWidth < 768) {
      return
    }

    const header = document.querySelector('header')
    let opacity = window.scrollY / 100
    if (opacity > 0.4) opacity = 0.4
    try {
      header.style.background = `rgba(0, 0, 0, ${opacity})`
    } catch (e) {
      //console.log(e)
    }
  })
})

function toggleMenu() {
  displayMenu.value.classList.toggle('hide')
  displayMenu.value.classList.toggle('show')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <RouterLink to="/" class="logo">
        <img src="@/assets/img/logo.png" alt="logo" />
        <h1>tokenly</h1>
      </RouterLink>
      <div class="search">
        <input type="text" :placeholder="$t('Search')" />
        <button>
          <i class="fas fa-search fa-sm"></i>
        </button>
      </div>
      <nav class="links">
        <ul>
          <li>
            <RouterLink to="/discover"> {{ $t('Discover') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/publish"> {{ $t('Publish') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites"> {{ $t('Favorites') }}</RouterLink>
          </li>
          <li v-if="!userStore.isLoggedIn">
            <RouterLink to="/login">
              {{ $t('Login') }}
            </RouterLink>
          </li>
          <li v-if="userStore.isLoggedIn">
            <RouterLink :to="`/profile?username=${userStore.username}`">
              {{ userStore.username }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="burger" @click="toggleMenu">
        <i class="fas fa-bars fa-2x"></i>
      </div>
      <div class="burger-menu hide" ref="displayMenu">
        <ul>
          <li>
            <RouterLink to="/discover"> {{ $t('Discover') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/publish"> {{ $t('Publish') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites"> {{ $t('Favorites') }}</RouterLink>
          </li>
          <li v-if="!userStore.isLoggedIn">
            <RouterLink to="/login">
              {{ $t('Login') }}
            </RouterLink>
          </li>
          <li v-if="userStore.isLoggedIn">
            <RouterLink :to="`/profile?username=${userStore.username}`">
              {{ userStore.username }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
