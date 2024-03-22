<script setup>
import "@/assets/css/profile/adminPanel.css"
import { ref } from 'vue'
import { getTransactions } from '@/services/TransactionService.js'

const active = ref(false)
const transactions = ref([])

async function fetchInfo() {
    console.log('fetching info')

    const transactionsResponse = await getTransactions()
    transactions.value = transactionsResponse.data
}

function openAdminPanel() {
    active.value = !active.value

    fetchInfo()
}
</script>

<template>
    <div class="admin-container">
        <button class="admin-button" @click="openAdminPanel">
            {{ $t('Admin Panel') }}
        </button>
        <div class="admin-display" v-if="active">
            <div class="admin-display-header">
                <h2>{{ $t('Admin Panel') }}</h2>
            </div>
            <div class="admin-display-body">
                <div class="admin-display-body-header">
                    <h3>{{ $t('Transactions') }}</h3>
                </div>
                <div class="admin-display-body-content">
                    <div class="admin-display-body-content-header">
                        <h4>{{ $t('Time') }}</h4>
                        <h4>{{ $t('Date') }}</h4>
                        <h4>{{ $t('Amount') }}</h4>
                        <h4>{{ $t('Seller') }}</h4>
                        <h4>{{ $t('Buyer') }}</h4>
                        <h4>{{ $t('Listing-id') }}</h4>
                    </div>
                    <div class="admin-display-body-content-body">
                        <div class="admin-display-body-content-body-row" v-for="transaction in transactions" :key="transaction.id">
                            <h4>{{ transaction.transactionTime }}</h4>
                            <h4>{{ transaction.transactionDate }}</h4>
                            <h4>{{ transaction.transactionPrice }}</h4>
                            <h4>{{ transaction.sellerName }}</h4>
                            <h4>{{ transaction.buyerName }}</h4>
                            <h4>{{ transaction.listingId }}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>