<script setup>
import '../../assets/css/discover/categoryButton.css'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import router from '@/router'

import Photography from '../../assets/img/category/Photography.jpg'
import Animation from '../../assets/img/category/Animation.gif'
import Wallpaper from '../../assets/img/category/Wallpaper.jpg'
import Animal from '../../assets/img/category/Animal.jpg'
import People from '../../assets/img/category/People.jpg'
import Cartoon from '../../assets/img/category/Cartoon.jpg'
import Art from '../../assets/img/category/Art.jpg'
import Collectibles from '../../assets/img/category/Collectibles.jpg'
import { fetchAllItemsByCategory } from '@/services/ItemService.js'

const { category } = defineProps({
  category: {
    type: String,
    required: true
  }
})

const categoryButton = ref(null)

let image = null

if (category == 'Photography') {
  image = Photography
} else if (category == 'Animation') {
  image = Animation
} else if (category == 'Wallpaper') {
  image = Wallpaper
} else if (category == 'Animal') {
  image = Animal
} else if (category == 'People') {
  image = People
} else if (category == 'Cartoon') {
  image = Cartoon
} else if (category == 'Art') {
  image = Art
} else if (category == 'Collectibles') {
  image = Collectibles
} else {
  image = Art
}

const onMouseOver = (event) => {
  // make the image tilt a bit in 3d space when hovering over it, depending on the mouse position
  const x = event.offsetX
  const y = event.offsetY
  const width = event.target.offsetWidth
  const height = event.target.offsetHeight
  const xPercent = (x / width) * 100 * 2
  const yPercent = (-y / height) * 100 * 4
  event.target.style.transform = `perspective(200px) rotateY(${(xPercent - 50) / 100}deg) rotateX(${
    (yPercent - 50) / 100
  }deg)`
}

const onMouseOut = (event) => {
  event.target.style.transform = 'none'
}

const handleClick = async (event) => {
  const selectedCategory = event.target.innerText

  router.push({
    name: 'discover',
    query: {
      category: selectedCategory
    }
  })
}
</script>

<template>
  <a @click="handleClick">
    <div
      class="category-button"
      ref="categoryButton"
      :style="{ backgroundImage: 'url(' + image + ')' }"
      @mousemove="onMouseOver"
      @mouseout="onMouseOut"
    >
      <div class="category-button-text">
        {{ category }}
      </div>
    </div>
  </a>
</template>
