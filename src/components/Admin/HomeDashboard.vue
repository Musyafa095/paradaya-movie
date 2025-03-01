<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header Section -->
    <header class="mb-8">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-3xl font-bold font-montserrat light:text-gray-900">AnimeFlix.com 🚀</h1>
        <div class="font-roboto text-gray-600 ">
          {{ currentTime }} WIB 🫠 
        </div>
      </div>
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class=" bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-700">Total Movie 🎥</h3>
          <p class="text-2xl font-bold text-blue-600">{{ totalMovieCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-700">Jumlah Genre 🎬 </h3>
          <p class="text-2xl font-bold text-green-600">{{ totalGenres }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-700">Terakhir Update Movie 💾</h3>
          <p class=" text-slate-600">{{ latestMovieUpdate }}</p>
        </div>
      </div>  
    </header>

    <!-- Categories Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Genres</h2>
      <div class="flex flex-wrap gap-2">
        <button
          @click="fetchMovieByGenre(null)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            !selectedGenre
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          All Movie
        </button>
        <button
          v-for="cat in genre"
          :key="cat.id"
          @click="fetchMovieByGenre(cat.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedGenre === cat.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Movie Grid -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Latest MOvie</h2>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- News Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
  <div v-for="movie in movieItems" :key="movie.id" class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden ease-in-out hover:scale-105">
    <img 
      :src="movie.poster || 'placeholder-image.jpg'" 
      :alt="movie.title"
      class="w-full h-40 sm:h-48 object-cover"
    >
    <div class="card-body p-4 sm:p-5">
      <div class="text-xs light:text-gray-900 mb-2 uppercase tracking-wide">  
        {{ formatDate(movie.created_at) }}
      </div>
      <h3 class="card-title text-base sm:text-lg font-semibold light:text-gray-800 mb-2 sm:mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
        {{ movie.title }}
      </h3>
      <p class="text-sm light:text-gray-600 mb-3 sm:mb-4  font-montserrat line-clamp-3">
        {{ movie.summary }}
      </p>
         </div>
      </div>
 </div>
    </section>
    <div class="join flex justify-center items-center mt-4">
  <button class="join-item btn btn-info"
  @click="changePage(currentPage - 1)" 
  :disabled="currentPage === 1"
  >« Prev</button>
  <button class="join-item btn">Halaman {{ currentPage }} dari {{ totalPages }}</button>
  <button class="join-item btn btn-secondary"
  @click="changePage(currentPage + 1)"
  :disabled="currentPage === totalPages"
  >Next »</button>
</div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGenreStore } from '@/stores/genre';
import { useMovieStore } from '@/stores/movie';


// Store initialization
const genreStore = useGenreStore();
const movieStore = useMovieStore();

// Use storeToRefs to maintain reactivity
const { genre } = storeToRefs(genreStore);
const { movie, isLoading, error, totalPages, totalMovieCount} = storeToRefs(movieStore);
const currentPage = ref(1);
// Local state
const currentTime = ref('');
const selectedGenre = ref(null);
const movieItems = computed(() => movie.value || []);
const totalGenres = computed(() => genre.value?.length || 0);


const hariIndonesia = {
  'Sunday': 'Minggu',
  'Monday': 'Senin',
  'Tuesday': 'Selasa',
  'Wednesday': 'Rabu',
  'Thursday': 'Kamis',
  'Friday': 'Jumat',
  'Saturday': 'Sabtu'
};

// Mapping for Indonesian months
const bulanIndonesia = {
  'January': 'Januari',
  'February': 'Februari',
  'March': 'Maret',
  'April': 'April',
  'May': 'Mei',
  'June': 'Juni',
  'July': 'Juli',
  'August': 'Agustus',
  'September': 'September',
  'October': 'Oktober',
  'November': 'November',
  'December': 'Desember'
};

// Computed properties


const latestMovieUpdate = computed(() => {
  if (movieItems.value && movieItems.value.length > 0) {
    const sortedMovie = [...movieItems.value].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    return formatDate(sortedMovie[0].created_at);
  }
  return 'Belum ada update';
});



// Methods
const updateTime = () => {
  const now = new Date();
  const weekday = hariIndonesia[now.toLocaleString('en-US', { weekday: 'long' })];
  const month = bulanIndonesia[now.toLocaleString('en-US', { month: 'long' })];
  const date = now.getDate();
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  currentTime.value = `${weekday}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};
const formatDate = (date) => {
  const d = new Date(date);
  const day = hariIndonesia[d.toLocaleString('en-US', { weekday: 'long' })];
  const month = bulanIndonesia[d.toLocaleString('en-US', { month: 'long' })];
  
  return `${day}, ${d.getDate()} ${month} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
// Fungsi mengambil berita berdasarkan kategori
const fetchMovieByGenre = async (genreId, page = 1) => {
  selectedGenre.value = genreId;
  try { 
    await movieStore.getMovie(page, genreId);
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
};

// Fungsi untuk mengambil berita dengan pagination
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {  
    currentPage.value = page;
    fetchMovieByGenre(selectedGenre.value, page);
  }
};


// Memuat data awal
onMounted(async () => {
  updateTime();
  setInterval(updateTime, 1000);       
  try {
    await Promise.all([
      genreStore.getGenre(),
      movieStore.getMovie(currentPage.value)  
    ]);
  } catch (err) {
    console.error("Error saat memuat data:", err);
  }
});
watch (currentPage, (newPage) => {
  fetchMovieByGenre(selectedGenre.value, newPage);
});
</script>