<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import router from '@/router'
import '@/assets/css/chat/message.css'
import { fetchListing } from '@/services/ListingsService.js'
import { throwErrorPopup } from '@/utils/ErrorController.js'
import { doTransaction } from '@/services/TransactionService.js'
import {fetchUserProfile} from '@/services/ProfileService.js'
import { sendAcceptBidNotification, closeMessage, sendDeclineBidNotification } from '@/services/ChatService.js'
import { useUserStore } from '@/stores/UserStore.js'
import { fetchBid } from '@/services/BidService.js'

const userStore = useUserStore()

const validMessage = ref(true)
const isActionMessage = ref(false)
let messageJson = null

const props = defineProps({
  message: Object
})
const isMe = computed(() => props.message.isMe)

async function acceptBid() {
  // Get listingId from bid
  let listingId = 0
  try {
    const fetchListingResponse = await fetchBid(messageJson.bidId)
    listingId = fetchListingResponse.data.listingId
  } catch (error) {
    throwErrorPopup("Something went wrong while fetching the listing, please try again later")
  }

  // Create a transaction
  const transaction = {
      buyerName: messageJson.buyerName,
      sellerName: userStore.username,
      transactionPrice: messageJson.amount,
      listingId: listingId,
  }

  // Send the transaction
  try {
      doTransaction(transaction)
  } catch (error) {
      throwErrorPopup("Something went wrong while sending the transaction, please try again later")
  }

  // Send the notification
  try {
      sendAcceptBidNotification(transaction.sellerName, transaction.buyerName, messageJson.bidId, transaction.transactionPrice, messageJson.itemId)
  } catch (error) {
      throwErrorPopup("Something went wrong while sending the notification, please try again later")
  }

  // Close the message
  try {
      closeMessage(props.message.messageId)
      throwErrorPopup("Bid accepted")
      router.push({ name: 'nft', query: { id: messageJson.itemId } })
  } catch (error) {
      throwErrorPopup("Something went wrong while closing the message")
  }
}

async function declineBid() {
    // Get listingId from bid
    let listingId = 0
  try {
    const fetchListingResponse = await fetchBid(messageJson.bidId)
    listingId = fetchListingResponse.data.listingId
  } catch (error) {
    throwErrorPopup("Something went wrong while fetching the listing, please try again later")
  }

  // Create a transaction
  const transaction = {
      buyerName: messageJson.buyerName,
      sellerName: userStore.username,
      transactionPrice: messageJson.amount,
      listingId: listingId,
  }

  // Send the notification
  try {
      sendDeclineBidNotification(transaction.sellerName, transaction.buyerName, messageJson.bidId, transaction.transactionPrice, messageJson.itemId)
  } catch (error) {
      throwErrorPopup("Something went wrong while sending the notification, please try again later")
  }

  // Close the message
  try {
      closeMessage(props.message.messageId)
      throwErrorPopup("Bid declined")
      router.push({ name: 'nft', query: { id: messageJson.itemId } })
  } catch (error) {
      throwErrorPopup("Something went wrong while closing the message")
  }
}

onMounted(async () => {
  // Check if the message is an action message
  if (props.message.message.startsWith('{')) {
    // Replace all ' with "
    props.message.message = props.message.message.replace(/'/g, '"')

    // Convert message to JSON
    messageJson = JSON.parse(props.message.message)
    console.log(messageJson)

    isActionMessage.value = true

    if (messageJson.type === 'bid') {
      //Check if the item is still available
      let listed = false
      try {
        const fetchListingResponse = await fetchListing(messageJson.itemId)
        listed = !fetchListingResponse.data.isClosed
      } catch (error) {
        throwErrorPopup("Something went wrong while fetching the listing, please try again later")
      }

      if (!listed) {
        validMessage.value = false
        return
      }

      //Check if the buyer has enough funds
      try {
        const response = await fetchUserProfile(messageJson.buyerName)
        if (response.data.balance < messageJson.amount) {
          validMessage.value = false
          return
        }
      } catch (error) {
        throwErrorPopup("Some messages went wrong while fetching the user's profile")
        validMessage.value = false
      }
    }
  }
})
</script>

<template>
  <div class="chat-content-message-item" :class="{ 'chat-content-message-item-me': message.isMe, 'action-message': isActionMessage }" v-if="validMessage">
    <p class="chat-content-message-text" v-if="messageJson === null">
      {{ message.message }}
    </p>
    <div class="chat-content-type" v-else>
      <div class="chat-bid" v-if="messageJson.type === 'bid'">
        <p class="chat-content-title">
          Bid placed on
          <RouterLink :to="'/nft?id=' + messageJson.itemId">
            NFT: {{ messageJson.itemId }}
          </RouterLink>
        </p>
        <p class="chat-content-message-text">
          {{ messageJson.amount }} <i class="fab fa-ethereum"></i>
        </p>
        <div class="chat-bid-actions" v-if="!isMe">
          <button class="chat-bid-action chat-bid-action-accept" @click="acceptBid">
            <i class="fas fa-check"></i>
          </button>
          <button class="chat-bid-action chat-bid-action-decline" @click="declineBid">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="chat-acceptance" v-else-if="messageJson.type === 'acceptance'">
        <p class="chat-content-title">
          Bid accepted on
          <RouterLink :to="'/nft?id=' + messageJson.itemId">
            NFT: {{ messageJson.itemId }}
          </RouterLink>
        </p>
        <p class="chat-content-message-text">
          {{ messageJson.amount }} <i class="fab fa-ethereum"></i>
        </p>
      </div>
      <div class="chat-decline" v-else-if="messageJson.type === 'decline'">
        <p class="chat-content-title">
          Bid declined on
          <RouterLink :to="'/nft?id=' + messageJson.itemId">
            NFT: {{ messageJson.itemId }}
          </RouterLink>
        </p>
        <p class="chat-content-message-text">
          {{ messageJson.amount }} <i class="fab fa-ethereum"></i>
        </p>
      </div>
      <div class="chat-purchase" v-else-if="messageJson.type === 'purchase'">
        <p class="chat-content-title">
          NFT purchased for {{ messageJson.amount }} <i class="fab fa-ethereum"></i>
        </p>
        <p class="chat-content-message-text">
          <RouterLink :to="'/nft?id=' + messageJson.itemId">
            NFT: {{ messageJson.itemId }}
          </RouterLink>
        </p>
      </div>
    </div>
    <p class="chat-content-message-time">{{ message.time }}</p>
  </div>
</template>
