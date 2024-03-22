<script setup>
import '@/assets/css/discover/nftTableHeader.css'
import { ref } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController.js'

const emit = defineEmits(['apply-filters'])

const showAllFilters = ref(false)

const showOrderDropdown = ref(false)
const showCategoryDropdown = ref(false)
const orderDropdownText = ref('Sort by')
const categorySuggestion = ref('')
const minPrice = ref('')
const maxPrice = ref('')

let selectedCategories = []
let categories = [
  'Art',
  'Music',
  'Sport',
  'Gaming',
  'Collectibles',
  'Fashion',
  'Photography',
  'Animal',
  'Food',
  'Travel',
  'Science',
  'Technology',
  'Politics',
  'Business',
  'Education',
  'Entertainment',
  'Other',
  'Wallpaper',
]

function resetAllFilters() {
  orderDropdownText.value = 'Sort by'
  selectedCategories = []
  minPrice.value = ''
  maxPrice.value = ''
}

const toggleDropdown = (dropdown, filter) => {
  if (dropdown === 'order') {
    orderDropdownText.value = filter
  }
}

const removeCategory = (category) => {
  selectedCategories = selectedCategories.filter((c) => c !== category)
  showCategoryDropdown.value = false
}

const addCategory = (category) => {
  showCategoryDropdown.value = false

  if (selectedCategories.length == 1) {
    throwErrorPopup('You can only select one category')
    return
  }

  if (selectedCategories.includes(category)) {
    return
  }
  selectedCategories.push(category)
}

const suggestCategoryInput = (event) => {
  const input = event.target.value
  if (input.length === 0) {
    categorySuggestion.value = ''
    return
  }
  const suggestedCategory = categories.find((c) => c.toLowerCase().startsWith(input.toLowerCase()))
  if (suggestedCategory) {
    categorySuggestion.value = suggestedCategory
  }
}

const applyFilters = () => {
  // Check if min price and max price are numbers
  if (minPrice.value !== '' && isNaN(minPrice.value)) {
    minPrice.value = '0'
  }

  if (maxPrice.value !== '' && isNaN(maxPrice.value)) {
    maxPrice.value = '0'
  }

  // Check if min price is less than max price
  if (minPrice.value !== '' && maxPrice.value !== '') {
    if (Number(minPrice.value) > Number(maxPrice.value)) {
      throwErrorPopup('Min price cannot be greater than max price')
      return
    }
  }

  emit('apply-filters', {
    sortBy: orderDropdownText.value,
    category: selectedCategories[0],
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  })
}

const trendingButton = () => {
  resetAllFilters()
  orderDropdownText.value = 'Trending'
  applyFilters()
}

const newlyListedButton = () => {
  resetAllFilters()
  orderDropdownText.value = 'Newest'
  applyFilters()
}

</script>

<template>
  <div class="nft-table-header" id="items">
    <div class="filters">
      <div class="left">
        <button class="filter-text-button" @click="trendingButton">Trending</button>
        <button class="filter-text-button" @click="newlyListedButton">Newly Listed</button>
      </div>
      <div class="right">
        <div class="filter-text-button-simple" @click="showAllFilters = !showAllFilters">
          <span>Filters</span>
          <span class="filter-text-button-icon">
            <i class="fas fa-chevron-down" v-if="!showAllFilters"></i>
            <i class="fas fa-chevron-up" v-if="showAllFilters"></i>
          </span>
        </div>
        <div class="filter-all-container" v-if="showAllFilters">
          <div class="filter-price">
          <div class="filter-price-inputs">
            <input type="text" placeholder="Min Price" size="8" v-model="minPrice" />
            <i class="fab fa-ethereum"></i>
            <input type="text" placeholder="Max Price" size="8" v-model="maxPrice" />
            <i class="fab fa-ethereum"></i>
          </div>
        </div>
        <div class="filter-text-button">
          <span @click="showCategoryDropdown = !showCategoryDropdown">
            Categories ({{ selectedCategories.length }})
          </span>
          <span
            class="filter-text-button-icon"
            @click="showCategoryDropdown = !showCategoryDropdown"
          >
            <i class="fas fa-chevron-down" v-if="!showCategoryDropdown"></i>
            <i class="fas fa-chevron-up" v-if="showCategoryDropdown"></i>
          </span>
          <div class="filter-text-button-dropdown" v-if="showCategoryDropdown">
            <div class="filter-text-button-dropdown-item">
              <input
                type="text"
                placeholder="Enter Category"
                class="filter-text-button-dropdown-item-input"
                @keyup.enter="addCategory($event.target.value)"
                @keyup="suggestCategoryInput($event)"
              />
              <span
                v-if="categorySuggestion.length > 0"
                class="filter-text-button-dropdown-item-suggestion"
                @click="addCategory(categorySuggestion)"
              >
                {{ categorySuggestion }}
              </span>
            </div>
            <div
              class="filter-text-button-dropdown-item"
              v-for="category in selectedCategories"
              :key="category"
              @click="removeCategory(category)"
            >
              <span>{{ category }}</span>
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>
        <div class="filter-text-button" @click="showOrderDropdown = !showOrderDropdown">
          <span>
            {{ orderDropdownText }}
          </span>
          <span class="filter-text-button-icon">
            <i class="fas fa-chevron-down" v-if="!showOrderDropdown"></i>
            <i class="fas fa-chevron-up" v-if="showOrderDropdown"></i>
          </span>
          <div class="filter-text-button-dropdown" v-if="showOrderDropdown">
            <div class="filter-text-button-dropdown-item" @click="toggleDropdown('order', 'Price')">
              <span>Price</span>
            </div>
            <div class="filter-text-button-dropdown-item" @click="toggleDropdown('order', 'Title')">
              <span>Title</span>
            </div>
            <div
              class="filter-text-button-dropdown-item"
              @click="toggleDropdown('order', 'Newest')"
            >
              <span>Newest</span>
            </div>
            <div
              class="filter-text-button-dropdown-item"
              @click="toggleDropdown('order', 'Oldest')"
            >
              <span>Oldest</span>
            </div>
          </div>
        </div>
        <button class="apply-filters-button" @click="applyFilters">Apply Filters</button>
        </div>
      </div>
    </div>
  </div>
</template>
