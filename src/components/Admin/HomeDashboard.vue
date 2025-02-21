<template>
  <div class="container mx-auto px-4 py-6 to-base-100">
    <!-- Header Section -->
    <header class="mb-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-600">ParadayaNews.com 🚀</h1>
        <div class="text-gray-700 font-roboto ">
          {{ currentTime }}
        </div>
      </div>
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Total Berita 📰</h3>
          <p class="text-2xl font-bold text-blue-600">{{ totalNews }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Jumalah Kategori 📝 </h3>
          <p class="text-2xl font-bold text-green-600">{{ totalCategories }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Latest Update 📖</h3>
          <p class="text-md text-gray-600">{{ latestUpdate }}</p>
        </div>
      </div>
    </header>

    <!-- Categories Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Categories</h2>
      <div class="flex flex-wrap gap-2">
        <button
          @click="fetchNewsByCategory(null)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            !selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          All News
        </button>
        <button
          v-for="cat in category"
          :key="cat.id"
          @click="fetchNewsByCategory(cat.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === cat.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- News Grid -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Latest News</h2>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- News Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="news in newsItems" :key="article.id" class="bg-white rounded-lg shadow overflow-hidden">
          <img 
            :src="news.image || 'placeholder-image.jpg'" 
            :alt="news.title"
            class="w-full h-48 object-cover"
          >
          <div class="p-4">
            <div class="text-sm text-gray-600 mb-2">
              {{ formatDate(news.created_at) }}
            </div>
            <h3 class="text-xl font-semibold mb-2 line-clamp-2">{{ news.title }}</h3>
            <p class="text-gray-600 mb-4 line-clamp-3">{{ news.content }}</p>
            <router-link 
              :to="{ name: 'NewsDetail', params: { id: news.id }}"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read More →
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import { useNewsStore } from '@/stores/news';

// Store initialization
const categoryStore = useCategoryStore();
const newsStore = useNewsStore();

// Use storeToRefs to maintain reactivity
const { category } = storeToRefs(categoryStore);
const { news, isLoading, error } = storeToRefs(newsStore);

// Local state
const currentTime = ref('');
const selectedCategory = ref(null);
const newsItems = ref([]);

// Computed properties
const totalNews = computed(() => newsItems.value?.length || 0);
const totalCategories = computed(() => category.value?.length || 0);
const latestUpdate = computed(() => {
  if (newsItems.value?.length > 0) {
    return formatDate(newsItems.value[0].created_at);
  }
  return 'No updates';
});

// Methods
const updateTime = () => {
  const now = new Date();
  currentTime.value = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(now);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchNewsByCategory = async (categoryId) => {
  selectedCategory.value = categoryId;
  try {
    const response = await newsStore.getNews(categoryId);
    newsItems.value = response.data;
  } catch (err) {
    console.error('Error fetching news:', err);
  }
};

// Initial data fetching
onMounted(async () => {
  updateTime();
  setInterval(updateTime, 1000);
  
  try {
    await categoryStore.getCategory();
    const response = await newsStore.getNews();
    newsItems.value = response.data;
  } catch (err) {
    console.error('Error fetching initial data:', err);
  }
});
</script>