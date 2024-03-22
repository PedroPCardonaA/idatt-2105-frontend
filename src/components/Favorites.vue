<script setup>
import '@/assets/css/favorites.css'
import { RouterLink } from 'vue-router'
import Title from '@/components/Title.vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/FavoritesStore.js'
import imageListFormat from '@/utils/ImageListFormatter.js'
import { removeItemFromFavorites, fetchAllFavorites } from '@/services/FavoritesService.js'
import { useUserStore } from '@/stores/UserStore.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'

onMounted(async () => {
  await fetchFavorites()
})

const favoritesStore = useFavoritesStore()
const userStore = useUserStore()

const { favorites } = storeToRefs(favoritesStore)

let nfts = computed(() => {
  return imageListFormat(favorites.value)
})

async function fetchFavorites() {
  const favorites = await fetchAllFavorites(userStore.username)
  favoritesStore.setFavorites(favorites.data)
}

const removeFromFavorites = async (nft) => {
  const params = { username: userStore.username, itemId: nft.itemId }
  await removeItemFromFavorites(params)
  await fetchFavorites()
  throwErrorPopup("Removed from favorites")
}
</script>

<template>
  <div class="favorites-wrapper">
    <Title title="Favorites" />
    <div class="favorites">
      <div class="favorites-empty" v-if="nfts.length === 0">
        <h2>{{ $t('No favorites') }}</h2>
        <p>
          {{ $t('No favorites text') }}
          <i class="fas fa-heart"></i>
        </p>
      </div>
      <div class="favorites-grid" v-else>
        <div class="favorites-grid-item" v-for="nft in nfts" :key="nft.title">
          <div class="favorites-grid-item-image">
            <i class="fas fa-times remove-icon" @click="removeFromFavorites(nft)"></i>
            <img :src="nft.filename" :alt="nft.alt" />
          </div>
          <div class="favorites-grid-item-info">
            <h3>{{ nft.title }}</h3>
            <p>
              {{ nft.price }}
              <i class="fab fa-ethereum"></i>
            </p>
          </div>
          <div class="favorites-grid-item-link">
            <RouterLink :to="nft.link">
              <i class="fas fa-arrow-right"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
