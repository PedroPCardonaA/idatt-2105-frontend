import { defineStore } from 'pinia'

export const useBalanceStore = defineStore({
  id: 'BalanceStore',
  state: () => ({
    currentBalance: 0.0,
    userId: 0
  }),
  persist: {
    //sessionStorage is used to store current balance in the browser's session storage
    storage: sessionStorage
  },
  actions: {
    setBalance(balance) {
      // 6 decimal places
      balance = Math.round(balance * 1000000) / 1000000

      this.currentBalance = balance
    },
    increaseBalance(balance) {
     
      this.currentBalance += balance
    },
    decreaseBalance(balance) {
      this.currentBalance -= balance
    },
    resetBalance() {
      this.currentBalance = 0.0
    },
    setUserId(userId) {
      this.userId = userId
    }
  },
  getters: {}
})
