<script setup>
import '@/assets/css/profile/wallet.css'
import { ref, onMounted } from 'vue'
import {useBalanceStore} from '@/stores/BalanceStore.js'
import {fetchUserProfile, addBalance} from '@/services/ProfileService.js'
import {useUserStore} from '@/stores/UserStore.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'

const balanceStore = useBalanceStore()

onMounted(async () => {
  const response = await fetchUserProfile(useUserStore().username)
  balanceStore.setUserId(response.data.id)
  balanceStore.setBalance(response.data.balance)
  balance.value = balanceStore.currentBalance
})

const displayDepositPopup = ref(false)
const displayWithdrawPopup = ref(false)
const depositErrorMsg = ref('')
const withdrawErrorMsg = ref('')
const loading = ref(false)

const depositAmount = ref(0.0)
const withdrawAmount = ref(0.0)
const balance = ref(balanceStore.currentBalance)

// Deposit to wallet
const deposit = async () => {
  if (!checkDepositAmount()) {
    return
  }

  //Do call to backend to deposit
  const response = await addBalance(balanceStore.userId, depositAmount.value)
  throwErrorPopup(response.data)

  //Set loading to true to show loading animation for 5 seconds
  loading.value = true
  displayDepositPopup.value = false
  setTimeout(() => {
    loading.value = false
  }, 5000)

  updateBalance()
}

// Withdraw from wallet
const withdraw = async () => {
  if (!checkWithdrawAmount()) {
    return
  }

  //Do call to backend to withdraw
  try {
    const response = await addBalance(balanceStore.userId, -withdrawAmount.value)
    throwErrorPopup(response.data)
  } catch (error) {
    throwErrorPopup(error)
    return
  }

  //Set loading to true to show loading animation for 5 seconds
  loading.value = true
  displayWithdrawPopup.value = false
  setTimeout(() => {
    loading.value = false
  }, 5000)

  updateBalance()
}

const checkDepositAmount = () => {
  if (depositAmount.value < 0.01) {
    depositErrorMsg.value = 'Minimum deposit amount is 0.01'
    return false
  } else if (depositAmount.value > 10) {
    depositErrorMsg.value = 'Maximum deposit amount is 10'
    return false
  } else {
    depositErrorMsg.value = ''
    return true
  }
}

const checkWithdrawAmount = () => {
  if (withdrawAmount.value < 0.01) {
    withdrawErrorMsg.value = 'Minimum withdraw amount is 0.01'
    return false
  } else if (withdrawAmount.value > 10) {
    withdrawErrorMsg.value = 'Maximum withdraw amount is 10'
    return false
  } else {
    withdrawErrorMsg.value = ''
    return true
  }
}

async function updateBalance() {
  const response = await fetchUserProfile(useUserStore().username)
  balanceStore.setUserId(response.data.id)
  balanceStore.setBalance(response.data.balance)
  balance.value = balanceStore.currentBalance
}

</script>

<template>
  <div class="wallet-container">
    <div class="wallet-status">
      <h1 class="wallet-balance">
        {{ $t('Balance') }}
        : {{ balance }}
        <i class="fab fa-ethereum"></i>
      </h1>
    </div>
    <div class="wallet-actions">
      <button class="wallet-action" @click="displayDepositPopup = true">
        <i class="fas fa-arrow-alt-to-left"></i>
        <span class="wallet-action-text">
          {{ $t('Deposit') }}
        </span>
      </button>
      <button class="wallet-action" @click="displayWithdrawPopup = true">
        <i class="fas fa-arrow-alt-from-left"></i>
        <span class="wallet-action-text">
          {{ $t('Withdraw') }}
        </span>
      </button>
    </div>
  </div>
  <div class="deposit-popup wallet-popup" v-if="displayDepositPopup">
    <i class="fas fa-times popup-close" @click="displayDepositPopup = false"></i>
    <h1 class="popup-title">
      {{ $t('Deposit') }}
    </h1>
    <div class="popup-input">
      <label class="popup-input-label">
        {{ $t('Amount to deposit in') }}
        <i class="fab fa-ethereum"></i>
      </label>
      <input type="text" class="popup-input-field" placeholder="Amount" v-model="depositAmount" />
    </div>
    <p class="popup-error">
      {{ depositErrorMsg }}
    </p>
    <button class="popup-button" @click="deposit">
      <i class="fas fa-arrow-alt-to-left"></i>
      <span class="popup-button-text">
        {{ $t('Deposit') }}
      </span>
    </button>
  </div>
  <div class="withdraw-popup wallet-popup" v-if="displayWithdrawPopup">
    <i class="fas fa-times popup-close" @click="displayWithdrawPopup = false"></i>
    <h1 class="popup-title">
      {{ $t('Withdraw') }}
    </h1>
    <div class="popup-input">
      <label class="popup-input-label">
        {{ $t('Amount to withdraw in') }}
        <i class="fab fa-ethereum"></i>
      </label>
      <input type="text" class="popup-input-field" placeholder="Amount" v-model="withdrawAmount" />
    </div>
    <p class="popup-error">
      {{ withdrawErrorMsg }}
    </p>
    <button class="popup-button" @click="withdraw">
      <i class="fas fa-arrow-alt-to-left"></i>
      <span class="popup-button-text">
        {{ $t('Withdraw') }}
      </span>
    </button>
  </div>
  <div class="loading-overlay wallet-popup" v-if="loading">
    <div class="loading-container">
      <div class="loading-background">
        <div class="loading-spinner" />
        <span class="loading-text">
          {{ $t('Loading') }}
          ...
        </span>
      </div>
    </div>
  </div>
</template>
