<script setup>
import '@/assets/css/profile/profile.css'
import { ref } from 'vue'
import Title from '@/components/Title.vue'
import ProfileSettings from './ProfileSettings.vue'
import AdminPanel from './AdminPanel.vue'
import Wallet from './Wallet.vue'
import { useUserStore } from '@/stores/UserStore.js'
import picon1 from '@/assets/img/profile_icons/picon1.jpg'
import { onMounted } from 'vue'
import imageListFormat from '@/utils/ImageListFormatter.js'
import { fetchItemsByOwner } from '@/services/ItemService.js'
import {fetchUserProfile, checkIfAdmin} from '@/services/ProfileService.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'
import router from '@/router'

const userStore = useUserStore()

const isAdmin = ref(false)


onMounted(async () => {
  // Fetch profile
  const profile = await fetchUserProfile(username.value)

  if (profile.data == null) {
    throwErrorPopup('Profile not found')
    router.push('/')
  }

  creatoinDate.value = profile.data.birthdate

  // Fetch items
  const fetchedItems = await fetchItemsByOwner(username.value)

  // Check if admin
  const adminResponse = await checkIfAdmin(username.value)
  isAdmin.value = adminResponse.data

  NFTs.value = imageListFormat(fetchedItems.data)
})

// Get params from url
const params = new URLSearchParams(window.location.search)
const username = ref(params.get('username'))
const profilePic = ref(picon1)
const creatoinDate = ref('2021-09-01')

const viewSettings = ref(false)

const NFTs = ref([])
</script>

<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <img class="profile-pic" :src="profilePic" alt="Profile Picture" />
      <h1 class="profile-username">{{ username }}</h1>
      <p class="profile-creation-date">{{ creatoinDate }}</p>
      <Wallet v-if="userStore.username === username" />
      <Title title="NFTs" />
      <div class="nfts-empty" v-if="NFTs.length === 0">
        <p class="nfts-empty-text">No NFTs to show</p>
      </div>
      <div class="nfts-grid" v-else>
        <div class="ntfs-item" v-for="nft in NFTs" :key="nft.title">
          <img class="nft-img" :src="nft.filename" :alt="nft.alt" />
          <div class="nft-item-info">
            <h3 class="nft-title">{{ nft.title }}</h3>
            <p class="nft-price">{{ nft.price }} <i class="fab fa-ethereum"></i></p>
          </div>
          <div class="nft-item-link">
            <router-link class="nft-link" :to="nft.link">
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
      <AdminPanel v-if="userStore.username === username && isAdmin" />
      <button
        class="profile-settings-btn"
        @click="viewSettings = !viewSettings"
        v-if="userStore.username === username"
      >
        Settings <i class="fas fa-cog"></i>
      </button>
      <ProfileSettings v-if="viewSettings" />
    </div>
  </div>
</template>
