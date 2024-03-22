<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/css/discover/categorySelector.css';
import CategoryButton from './CategoryButton.vue';

const mainDiv = ref(null);
const leftOver = ref(null);

const route = useRoute();
const category = computed(() => route.query.category);

const handleCategoryChange = (value) => {
  if (value) {
    mainDiv.value.style.display = 'none';
    leftOver.value.style.display = 'block';
  } else {
    console.log('Category does not exist');
  }
};

onMounted(() => {
  handleCategoryChange(category.value);

  watch(category, handleCategoryChange, { immediate: true });
});
</script>


<template>
  <div class="category-selector" ref="mainDiv">
    <div class="category-wrapper">
      <div class="category-row">
        <CategoryButton category="Photography" />
        <CategoryButton category="Animation" />
        <CategoryButton category="Wallpaper" />
        <CategoryButton category="Animal" />
      </div>
      <div class="category-row">
        <CategoryButton category="People" />
        <CategoryButton category="Cartoon" />
        <CategoryButton category="Art" />
        <CategoryButton category="Collectibles" />
      </div>
    </div>
    <div class="category-scrolldown">
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
  <div class="leftover-section" ref="leftOver"></div>
</template>
