<template>
  <DefaultLayout>
    <!-- Category Navigation -->
    <div class="flex overflow-x-auto whitespace-nowrap bg-gradient-to-r from-red-600 via-purple-800 to-blue-600 p-2.5 scrollbar-hide gap-2.5">
      <button
        @click="currentCategory = null"
        :class="[
          'flex-none px-4 py-2 text-white font-bold rounded transition-colors',
          !currentCategory ? 'bg-white/20' : 'hover:bg-white/10'
        ]"
      >
        Semua
      </button>
      <button
        v-for="item in category.category"
        :key="item.id"
        @click="currentCategory = item.id"
        :class="[
          'flex-none px-4 py-2 text-white font-bold rounded transition-colors',
          currentCategory === item.id ? 'bg-white/20' : 'hover:bg-white/10'
        ]"
      >
        {{ item.name }}
      </button>
    </div>
    
    <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 class="text-2xl md:text-4xl font-bold mb-6 light:text-gray-900 text-center font-montserrat">
        {{ currentCategory ? `Berita ${getCategoryName}` : 'Semua Berita' }}
      </h1>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="text-red-600 text-center py-8">
        {{ error }}
        <button @click="fetchNews" class="btn btn-primary mt-4">Coba Lagi</button>
      </div>
      
      <!-- News grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CardNews :dataProps="filteredNews" />
      </div>
    </div>
    <!-- pagnitation -->
    <div class="join flex justify-center items-center">
  <button class="join-item btn btn-info"
  @click="changePage(currentPage - 1)" 
  :disabled="currentPage === 1"
  >« Prev</button>
  <button class="join-item btn">Halaman {{ currentPage }}{{ totalPages }}</button>
  <button class="join-item btn btn-secondary"
  @click="changePage(currentPage + 1)"
  :disabled="currentPage === totalPages"
  >Next »</button>
</div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCategoryStore } from "@/stores/category";
import { useNewsStore } from "@/stores/news";
import { useSearchStore } from "@/stores/search";
import DefaultLayout from "@/layouts/Default.vue";
import CardMovie from "@/components/CardMovie.vue";

const category = useCategoryStore();
const searchStore = useSearchStore();
const router = useRouter();
const route = useRoute()
const news = useNewsStore();
const isLoading = ref(true);
const error = ref(null);
const currentCategory = ref(null);
const currentPage = ref(1);

const getCategoryName = computed(() => {
  if (!currentCategory.value) return "";
  const found = category.category.find((cat) => cat.id === currentCategory.value);
  return found ? found.name : "";
});

// Cek apakah ada query pencarian
const filteredNews = computed(() => {
  if (searchStore.searchQuery) {
    return news.news.filter((item) =>
      item.title.toLowerCase().includes(route.query.search.toLowerCase())
    );
  }
  if (!currentCategory.value) return news.news;
  return news.news.filter((item) => item.category_id === currentCategory.value);
});
watch(
  () => searchStore.searchQuery,
  (newQuery) => {
    router.replace({ query: { search: newQuery || undefined } });
  }
);

// Saat halaman pertama kali dibuka, ambil search dari URL
watch(
  () => route.query.search,
  (newQuery) => {
    searchStore.searchQuery = newQuery || "";
  },
  { immediate: true }
);

const fetchNews = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    await Promise.all([
      category.getCategory(),
      news.getNews(currentPage.value)
    ]);
  } catch (err) {
    error.value = "Gagal memuat data";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
const changePage = (page) => {
  if (page >= 1 && page <= news.totalPages) {
    currentPage.value = page;
    fetchNews();
  }
};
watch (currentPage, fetchNews);

onMounted(fetchNews);
</script>