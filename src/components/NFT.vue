<script setup>
import '../assets/css/nft.css'
import '@fortawesome/fontawesome-free/css/all.css'
import picon1 from '../assets/img/profile_icons/picon1.jpg'
import { useUserStore } from '@/stores/UserStore.js'
import {
  addToFavorites,
  removeItemFromFavorites,
  fetchAllFavorites
} from '@/services/FavoritesService.js'
import { useFavoritesStore } from '@/stores/FavoritesStore.js'
import { fetchItemById, addVisitById } from '@/services/ItemService.js'
import { ref, onMounted } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController.js'
import {fetchUserProfile} from '@/services/ProfileService.js'
import router from '../router'
import { doTransaction } from '@/services/TransactionService.js'
import { sendPurchaseNotification, sendBidNotification } from '@/services/ChatService.js'
import { createBid } from '@/services/BidService.js'

const favoritesStore = useFavoritesStore()

const userStore = useUserStore()

const image = ref({
  filename: '',
  alt: '',
  title: '',
  description: '',
  price: '',
  bidPrice: ''
})
const user = ref({
  name: '',
  image: ''
})

const listingId = ref(0)
const isOwner = ref(false)
const bidAmount = ref(0)
const purchaseAmount = ref(0)
const confirmBid = ref(false)
const confirmPurchase = ref(false)

const visits = ref(0)

const params = new URLSearchParams(window.location.search)
const id = params.get('id')

let targetFavorites = favoritesStore.getFavorites
var item = null

// Buy and bid actions
async function buy() {
  if (isOwner.value) {
    throwErrorPopup('You are the owner of this item')
    return
  }

  if (!await checkBalance(purchaseAmount.value)) {
    return
  }

  if (confirmPurchase.value) {
    // Create a transaction
    const transaction = {
      buyerName: userStore.username,
      sellerName: item.ownerName,
      transactionPrice: purchaseAmount.value,
      listingId: listingId.value
    }

    console.log(transaction)

    // Send the transaction
    try {
      await doTransaction(transaction)
      await sendPurchaseNotification(item.ownerName, userStore.username, purchaseAmount.value, id)

    } catch (error) {
      throwErrorPopup('Purchase failed, try again later')
      return
    }

    throwErrorPopup('Purchase confirmed')
    router.push('/')
  } else {
    confirmPurchase.value = true
    throwErrorPopup('Click again to confirm')
  }
}

async function bid() {
  if (isOwner.value) {
    throwErrorPopup('You are the owner of this item')
    return
  }

  if (bidAmount.value < image.value.bidPrice) {
    throwErrorPopup('Bid must be greater than ' + image.value.bidPrice)
    return
  }

  if (!await checkBalance(bidAmount.value)) {
    return
  }

  if (confirmBid.value) {
    // Create a bid
    const bid = {
      buyerName: userStore.username,
      price: bidAmount.value,
      listingId: listingId.value
    }

    try {
      const response = await createBid(bid)

      await sendBidNotification(item.ownerName, userStore.username, response.data.bidId, bidAmount.value, id)

      throwErrorPopup('Bid confirmed')
      router.push('/')
    } catch (error) {
      throwErrorPopup('Bid failed, try again later')
      return
    }
  } else {
    confirmBid.value = true
    throwErrorPopup('Click again to confirm')
  }
}

async function checkBalance(price) {
  const response = await fetchUserProfile(userStore.username)
  if (response.data.balance < price) {
    throwErrorPopup('Insufficient balance')
    return false
  }
  return true
}

// Navigate to the profile page
function goToProfile() {
  router.push({
    name: 'profile',
    query: {
      username: user.value.name
    }
  })
}

// Check if the item is in the favorites store
const isFavorite = ref(false)

// Update the favorites store when the component is mounted
onMounted(async () => {
  if (useUserStore().isLoggedIn) {
    await fetchFavorites()
  }

  if (!item) {
    try {
      const responseItem = await fetchItemById(id)
      if (responseItem.data.listingId != null) {
        const responseListing = await addVisitById(responseItem.data.listingId)
        visits.value = responseListing.data
      }
      item = responseItem.data
      image.value = {
        filename: 'http://localhost:8080/api/source/' + id,
        alt: 'Image displayed in the NFT card',
        title: item.itemName,
        description: item.description,
        price: item.maxPrice,
        bidPrice: item.minPrice
      }
      user.value = {
        name: item.ownerName,
        image: picon1
      }

      // Set the bid and purchase amount to the minimum bid price
      bidAmount.value = item.minPrice
      purchaseAmount.value = item.maxPrice

      // Set the listing id
      listingId.value = item.listingId

      // Check if the user is the owner of the item
      if (userStore.username == item.ownerName) {
        isOwner.value = true
      }
    } catch (error) {
      console.log(error)
      throwErrorPopup("NFT not found")
      router.push('/')
    }
  } else {
    image.value = {
      filename: 'http://localhost:8080/api/source/' + id,
      alt: 'Image displayed in the NFT card',
      title: item.itemName,
      description: item.description,
      price: item.maxPrice,
      bidPrice: item.minPrice
    }

    user.value = {
      name: item.ownerName,
      image: picon1
    }
  }
})

async function fetchFavorites() {
  const favorites = await fetchAllFavorites(userStore.username)
  favoritesStore.setFavorites(favorites.data)

  targetFavorites = favoritesStore.getFavorites
  for (let i = 0; i < targetFavorites.length; i++) {
    if (targetFavorites[i].itemId == id) {
      isFavorite.value = true
      break
    }
  }
}

//Image tilt on hover effect
const onMouseOver = (event) => {
  // make the image tilt a bit in 3d space when hovering over it, depending on the mouse position
  const x = event.offsetX
  const y = event.offsetY
  const width = event.target.offsetWidth
  const height = event.target.offsetHeight
  const xPercent = (x / width) * 100 * 4
  const yPercent = (-y / height) * 100 * 8
  event.target.style.transform = `perspective(1000px) rotateY(${
    (xPercent - 50) / 100
  }deg) rotateX(${(yPercent - 50) / 100}deg)`
}

// Reset the image tilt when the mouse leaves the image
const onMouseOut = (event) => {
  event.target.style.transform = 'none'
}

//Handle favorite click event, add or remove item from favorites
async function handleFavoriteClick() {
  await fetchFavorites()
  let isPresent = false

  const targetFavorites = favoritesStore.getFavorites

  for (let i = 0; i < targetFavorites.length; i++) {
    if (targetFavorites[i].itemId == id) {
      isPresent = true
      break
    }
  }
  if(isPresent) { //Check if the item is already in favorites
      const params = { "username": userStore.username, "itemId": id }
      await removeItemFromFavorites(params)
      isFavorite.value = false
      throwErrorPopup('Item removed from favorites')
  }
  else {
    const favorite = {
      username: userStore.getUsername(),
      itemId: id
    }
    try {
    await addToFavorites(favorite)
    isFavorite.value = true
    throwErrorPopup('Item added to favorites')
    } catch (error) {
      throwErrorPopup('Item already in favorites')
    }
  }
}
</script>

<template>
  <div class="nft-wrapper">
    <div class="nft-container">
      <div class="nft-image-container">
        <img
          class="nft-image"
          :src="image.filename"
          :alt="image.alt"
          @mousemove="onMouseOver"
          @mouseout="onMouseOut"
        />
      </div>
      <div class="buttons" v-if="useUserStore().isLoggedIn">
        <div class="buy-buttons-row">
          <button class="buy-button">
            <p @click="bid()">{{ $t('Bid') }}</p>
            <div class="price">
              <input
                class="bid-input"
                type="number"
                v-model="bidAmount"
                placeholder="0.00"
              />
              <i class="fab fa-ethereum"></i>
            </div>
          </button>
          <button class="buy-button" @click="buy()">
            <p>{{ $t('Buy') }}</p>
            <div class="price">
              {{ image.price }}
              <i class="fab fa-ethereum"></i>
            </div>
          </button>
        </div>
        <button class="favourite-button" @click="handleFavoriteClick()">
          <i class="far fa-heart" v-if="!isFavorite"></i>
          <i class="fas fa-heart" v-else></i>
        </button>
      </div>
      <h1 class="nft-title">{{ image.title }}</h1>
      <p class="nft-views">{{ visits }} 
        <i class="far fa-eye"></i>
      </p>
      <p class="nft-description">{{ image.description }}</p>
      <div class="user-tag" @click="goToProfile()">
        <img :src="user.image" :alt="user.name" />
        <div class="user-tag-info">
          <p class="user-tag-name">
            {{ user.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
