<template>
  <DefaultLayout>
    <div>
    <div class="flex overflow-x-auto whitespace-nowrap bg-gradient-to-r from-red-600 via-purple-800 to-blue-600 p-2.5  scrollbar-hide gap-2.5 capitalize font-roboto font-bold">
      <RouterLink
        v-for="item in category.category"
        :key="item.id"
        :to="`/category/${item.id}`"
        class="flex-none px-4 py-2 text-white font-bold rounded hover:bg-white/10 transition-colors"
      >
        {{ item.name }}
      </RouterLink>
    </div>
  </div>
  <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8">
  <h1 class="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
    Recommended for you
  </h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    <CardProduct :dataProps="filteredNews" />
  </div>
</div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useCategoryStore } from "@/stores/category";
import { useNewsStore } from "@/stores/news";
import { useSearchStore } from "@/stores/search";
import DefaultLayout from "@/layouts/Default.vue";


const category = useCategoryStore();
const news = useNewsStore();
const isLoading = ref(true);
const  searchStore = useSearchStore();

const handleGetCategory = async () => {
  try {
    const res = await category.getCategory();
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const handleGetNews = async () => {
  try {
    const res = await news.getNews();
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const filteredNews = computed(() => {
  if (!searchStore.searchQuery.value) {
    return news.news;
  }
  return news.news.filter((p) =>
    p.name.toLowerCase().includes(searchStore.searchQuery.toLowerCase())
  );
});

onMounted(() => {
  handleGetCategory();
  handleGetNews();
});
</script>

