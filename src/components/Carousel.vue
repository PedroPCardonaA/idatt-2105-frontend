<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Autoplay } from 'swiper'
import { RouterLink } from 'vue-router'
import 'swiper/swiper-bundle.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '../assets/css/carousel.css'
import { ref, onMounted } from 'vue'
import { fetchAllItems } from '@/services/ItemService.js'
import imageListFormat from '@/utils/ImageListFormatter'

const props = defineProps({
  type: String,
})

const images = ref([])

onMounted(async () => {
  let tempItems = []

  if (props.type === 'trending') {
    tempItems = await fetchAllItems({ sortBy: 'visits', size: 8})
  } else if (props.type === 'newest') {
    tempItems = await fetchAllItems({ sortBy: 'publication_time', size: 8})
  }

  images.value = imageListFormat(tempItems.data)
})

SwiperCore.use([Autoplay])



const slidesPerView = ref('4')

//If the screen is less than 768px, the number of slides displayed should be 2
if (window.innerWidth < 768) {
  slidesPerView.value = '2'
}
</script>

<template>
  <div class="swiper">
    <swiper :slides-per-view="slidesPerView" :autoplay="{ delay: 5000 }" loop>
      <swiper-slide v-for="(image, index) in images" :key="index">
        <RouterLink :to="image.link">
          <div class="swiperImg" :style="{ backgroundImage: `url('${image.filename}'` }">
            <div class="swiperImg_overlay">
              <div class="swiperImg__title">{{ image.title }}</div>
              <div class="swiperImg__price">
                {{ image.price }}
                <i class="fab fa-ethereum"></i>
              </div>
            </div>
          </div>
        </RouterLink>
      </swiper-slide>
    </swiper>
  </div>
</template>
