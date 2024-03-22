<script setup>
import '../assets/css/footer.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { RouterLink } from 'vue-router'

const changeLanguage = () => {
  const language = document.getElementById('language').value
  console.log('changed language to: ' + language)
  //localStorage.setItem('language', language)
  //window.location.reload()
}
</script>

<template>
  <div class="footer">
    <div class="containers">
      <div class="footer-container">
        <h2 class="footer-title">{{ $t('Links') }}</h2>
        <div class="footer-links">
          <RouterLink to="/">{{ $t('Home') }}</RouterLink>
          <RouterLink to="/discover">{{ $t('Discover') }}</RouterLink>
          <RouterLink to="/publish">{{ $t('Publish') }}</RouterLink>
          <RouterLink to="/login">{{ $t('Login') }}</RouterLink>
        </div>
      </div>
      <div class="footer-container">
        <h2 class="footer-title">{{ $t('Social') }}</h2>
        <div class="footer-links">
          <a href="https://twitter.com/0xNFT" target="_blank">
            <i class="fab fa-twitter"></i>
            Twitter
          </a>
          <a href="https://instagram.com/0xNFT" target="_blank">
            <i class="fab fa-instagram"></i>
            Instagram
          </a>
          <a href="https://facebook.com/0xNFT" target="_blank">
            <i class="fab fa-facebook"></i>
            Facebook
          </a>
          <a href="https://reddit.com/r/0xNFT" target="_blank">
            <i class="fab fa-reddit"></i>
            Reddit
          </a>
          <a href="https://discord.gg/0xNFT" target="_blank">
            <i class="fab fa-discord"></i>
            Discord
          </a>
        </div>
      </div>
      <div class="footer-container">
        <h2 class="footer-title">{{ $t('Legal') }}</h2>
        <div class="footer-links">
          <RouterLink to="/terms">{{ $t('Terms') }}</RouterLink>
          <RouterLink to="/privacy">{{ $t('Privacy') }}</RouterLink>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <img src="@/assets/img/logo.png" alt="logo" />
      <p>{{ $t('Select Language') }}</p>
      <select class="footer-language" name="language" id="language" v-model="$i18n.locale">
        <option value="" disabled selected>{{ $t('Select Language') }}</option>
        <option value="en">English</option>
        <option value="nb">Norsk bokmål</option>
        <option value="nn">Nynorsk</option>
        <option value="es">Español</option>
      </select>
      <p>© 2023 tokenly. All rights reserved.</p>
    </div>
  </div>
</template>
