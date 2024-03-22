import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import messages from '@intlify/unplugin-vue-i18n/messages'

const defaultLanguage = (navigator.language || navigator.userLanguage).slice(0,2)

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLanguage,
  fallbackLocale: 'en',
  availableLocales: ['en', 'nb', 'no', 'nn', 'es'],
  messages: messages
})

import './assets/css/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(i18n)


app.mount('#app')
