import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore({
  id: 'FavoritesStore',
  state: () => ({
    favorites: []
  }),
  persist: {
    //sessionStorage is used to store the favorites of the logged in user in the browser's session storage
    storage: sessionStorage
  },
  actions: {
    async setFavorites(favorites) {
      this.favorites = favorites
    },
    resetFavorites() {
      this.favorites = []
    }
  },
  getters: {
    getFavorites() {
      return this.favorites
    }
  }
})
