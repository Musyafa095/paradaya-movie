<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="text-center md:text-left">
        <h1 class="text-3xl font-bold text-gray-800">Selamat Datang, Admin</h1>
        <p class="text-gray-600">Portal Berita Dashboard</p>
      </div>
      <div class="text-right text-sm text-gray-500 mt-2 md:mt-0">{{ currentDate }}</div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Pembaca" :value="totalViews" icon="fas fa-users" color="text-blue-500" />
      <StatCard title="News Diterbitkan" :value="totalNews" icon="fas fa-newspaper" color="text-purple-500" />
      <StatCard title="Total Komentar" :value="totalComments" icon="fas fa-comments" color="text-orange-500" />
      <StatCard title="Total Share" :value="totalShares" icon="fas fa-share-alt" color="text-green-500" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Statistik Pembaca">
        <canvas ref="viewsChart"></canvas>
      </ChartCard>
      <ChartCard title="Kategori yang Sering Dilihat">
        <canvas ref="categoryChart"></canvas>
      </ChartCard>
    </div>

    <!-- News Terbaru -->
    <div class="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h3 class="text-lg font-semibold mb-4">News Terbaru</h3>
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="bg-gray-50 text-gray-500 uppercase">
            <th class="px-4 py-3">Judul</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Views</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="newsItem in news" :key="newsItem.id">
            <td class="px-4 py-3">{{ newsItem.title }}</td>
            <td class="px-4 py-3">{{ newsItem.category.name }}</td>
            <td class="px-4 py-3">{{ newsItem.views }}</td>
            <td class="px-4 py-3">
              <span :class="getStatusClass(newsItem.status)">{{ newsItem.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNewsStore } from '@/stores/news';
import { useCategoryStore } from '@/stores/category';

const newsStore = useNewsStore();
const categoryStore = useCategoryStore();
const viewsChart = ref(null);
const categoryChart = ref(null);

const news = computed(() => newsStore.news);
const totalViews = computed(() => newsStore.news.reduce((sum, item) => sum + item.views, 0));
const totalNews = computed(() => newsStore.news.length);
const totalComments = computed(() => newsStore.news.reduce((sum, item) => sum + item.comments, 0));
const totalShares = computed(() => newsStore.news.reduce((sum, item) => sum + item.shares, 0));
const popularCategories = computed(() => categoryStore.category);

const currentDate = computed(() => new Date().toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}));

const getStatusClass = (status) => ({
  'px-2 py-1 rounded text-xs font-medium': true,
  'bg-green-100 text-green-800': status === 'Published',
  'bg-yellow-100 text-yellow-800': status === 'Draft'
});

onMounted(async () => {
  await newsStore.getNews();
  await categoryStore.getCategory();

  new Chart(viewsChart.value, {
    type: 'line',
    data: {
      labels: newsStore.news.map((_, index) => `Day ${index + 1}`),
      datasets: [{
        label: 'Views',
        data: newsStore.news.map(news => news.views),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });

  new Chart(categoryChart.value, {
    type: 'bar',
    data: {
      labels: popularCategories.map(cat => cat.name),
      datasets: [{
        label: 'Jumlah Artikel',
        data: popularCategories.map(cat => cat.articleCount),
        backgroundColor: 'rgb(54, 162, 235)'
      }]
    }
  });
});
</script>
