<template>
  <Default>
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-600 py-8">
        {{ error }}
        <button @click="fetchNewsDetail" class="btn btn-primary mt-4">
          Coba Lagi
        </button>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Back Button -->
        <RouterLink to="/" class="btn btn-ghost mb-6 text-gray-700 dark:text-gray-300">
          ← Kembali ke Beranda
        </RouterLink>

        <article class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <!-- Title -->
          <h1 class="px-6 pt-6 md:px-8 md:pt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {{ newsDetail.title }}
          </h1>

          <!-- Date -->
          <div class="px-6 md:px-8 mt-4">
            <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
              {{ formatDate(newsDetail.data.date) }}
            </span>
          </div>

          <!-- Featured Image -->
          <div class="mt-6">
            <img
              :src="newsDetail.image"
              :alt="newsDetail.title"
              class="w-full h-auto object-cover max-h-[600px]"
            />
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <div v-html="formattedContent" class="text-gray-800 dark:text-gray-200"></div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Komentar</h2>
            <div class="space-y-6">
              <!-- Comment Form -->
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <textarea
                  v-model="newComment"
                  placeholder="Tulis komentar Anda..."
                  class="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                  rows="3"
                ></textarea>
                <button class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Kirim Komentar
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </Default>
</template>

<script setup>
import { useRoute, RouterLink } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { useNewsStore } from "@/stores/news";
import Default from "@/layouts/Default.vue";

const route = useRoute();
const id = route.params.id;
const store = useNewsStore();
const newsDetail = ref({});
const isLoading = ref(true);
const error = ref(null);
const newComment = ref("");

// Format date in Indonesian locale
const formatDate = (date) => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
};

// Format content with proper paragraph spacing
const formattedContent = computed(() => {
  if (!newsDetail.value.content) return "";
  return newsDetail.value.content
    .split(/\n\n+/)
    .map(paragraph => `<p>${paragraph}</p>`)
    .join("\n");
});

const fetchNewsDetail = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    newsDetail.value = await store.getNewsById(id);
  } catch (err) {
    error.value = "Gagal memuat detail berita";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchNewsDetail);
</script>

<style>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.8;
  color: rgb(55, 65, 81);
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .prose p {
    color: rgb(229, 231, 235);
  }
}

/* Responsive font sizes */
@media (max-width: 768px) {
  .prose p {
    font-size: 1rem;
    line-height: 1.7;
  }
}
</style>