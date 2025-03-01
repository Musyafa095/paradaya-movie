<template>
  <DefaultLayout>
    <!-- Genre Navigation - Made transparent with backdrop blur -->
    <div class="sticky top-0 z-20 backdrop-blur-md bg-black/30 shadow-lg">
      <div class="container mx-auto flex overflow-x-auto whitespace-nowrap py-3 scrollbar-hide gap-2.5">
        <button
          @click="currentGenre = null"
          :class="[
            'flex-none px-4 py-2 text-white font-montserrat font-bold rounded-lg transition-all duration-300',
            !currentGenre ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 shadow-md' : 'bg-white/10 hover:bg-white/20'
          ]"
        >
          Semua
        </button>
        <button
          v-for="item in genre.genre"
          :key="item.id"
          @click="currentGenre = item.id"
          :class="[
            'flex-none px-4 py-2 text-white font-monserrat font-bold rounded-lg transition-all duration-300',
            currentGenre === item.id ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 shadow-md' : 'bg-white/10 hover:bg-white/20'
          ]"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
    
    <div class="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 class="text-2xl md:text-4xl font-bold mb-6 light:text-gray-900 text-center font-montserrat">
        {{ currentGenre ? `Anime ${getGenreName}` : 'Semua Anime' }}
      </h1>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="text-red-600 text-center py-8">
        {{ error }}
        <button @click="fetchMovies" class="btn btn-primary mt-4">Coba Lagi</button>
      </div>
      
      <!-- Movie grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <CardMovie :dataProps="filteredMovies" />
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="join flex justify-center items-center mb-10">
      <button class="join-item btn btn-info" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">« Prev</button>
      <button class="join-item btn">Halaman {{ currentPage }} / {{ movie.totalPages }}</button>
      <button class="join-item btn btn-secondary" @click="changePage(currentPage + 1)" :disabled="currentPage === movie.totalPages">Next »</button>
    </div>
    
    <!-- Feature Carousel Section -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10 shadow-lg "></div>
      
      <!-- Carousel for rotating posters -->
      <div class="carousel w-full min-h-[80vh]">
        <div 
          v-for="(poster, index) in heroPosters" 
          :key="index"
          :id="`slide${index}`"
          :class="['carousel-item relative w-full bg-cover bg-center min-h-[80vh] rounded-lg', 
                  {'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index}]"
          :style="`background-image: url('${poster}')`"
        >
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-20">
            <a @click.prevent="prevSlide" class="btn btn-circle btn-ghost text-white">❮</a>
            <a @click.prevent="nextSlide" class="btn btn-circle btn-ghost text-white">❯</a>
          </div>
        </div>
      </div>
      
      <div class="hero-content text-left text-white z-20 absolute top-0 left-0 w-full h-full flex items-center">
        <div class="max-w-xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 class="text-3xl font-bold mb-4">Anime Terbaru</h2>
          <p class="mb-5 text-lg">Streaming anime terbaik di indonesia. Temukan koleksi terlengkap hanya di AnimeFlix🍿.</p>
          <button class="btn btn-info"> 🚀 Tonton Sekarang!</button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGenreStore } from "@/stores/genre";
import { useMovieStore } from "@/stores/movie";
import { useSearchStore } from "@/stores/search";
import DefaultLayout from "@/layouts/Default.vue";
import CardMovie from "@/components/CardMovie.vue";

const genre = useGenreStore();
const searchStore = useSearchStore();
const router = useRouter();
const route = useRoute();
const movie = useMovieStore();
const isLoading = ref(true);
const error = ref(null);
const currentGenre = ref(null);
const currentPage = ref(1);

const heroPosters = ref([
  'https://i.pinimg.com/736x/19/0d/38/190d381e8add80ebef59c9651ed9e073.jpg',
  'https://i.pinimg.com/736x/c1/b2/50/c1b250305d69afb6c3d5818809ff9032.jpg',
  'https://i.pinimg.com/736x/e7/40/28/e740288ece3d9caa36abdd05ee4fda7a.jpg',
  'https://i.pinimg.com/736x/a4/50/bc/a450bcb4ad32e7f5b9e7db259b0bea61.jpg'
]);
const currentSlide = ref(0);
let slideInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroPosters.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroPosters.value.length) % heroPosters.value.length;
};

const startSlideTimer = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
};

const getGenreName = computed(() => {
  if (!currentGenre.value) return "";
  const found = genre.genre.find((g) => g.id === currentGenre.value);
  return found ? found.name : "";
});

const filteredMovies = computed(() => {
  if (searchStore.searchQuery) {
    return movie.movie.filter((item) =>
      item.title.toLowerCase().includes(searchStore.searchQuery.toLowerCase())
    );
  }
  if (!currentGenre.value) return movie.movie;
  return movie.movie.filter((item) => item.genre_id === currentGenre.value);
});

watch(
  () => searchStore.searchQuery,
  (newQuery) => {
    router.replace({ query: { search: newQuery || undefined } });
  }
);

watch(
  () => route.query.search,
  (newQuery) => {
    searchStore.searchQuery = newQuery || "";
  },
  { immediate: true }
);

const fetchMovies = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    await Promise.all([
      genre.getGenre(),
      movie.getMovie(currentPage.value)
    ]);
  } catch (err) {
    error.value = "Gagal memuat data";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= movie.totalPages) {
    currentPage.value = page;
    fetchMovies();
  }
};

watch(currentPage, fetchMovies);

onMounted(() => {
  startSlideTimer();
  fetchMovies();
});

onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animation for carousel */
.carousel-item {
  transition: opacity 0.6s ease-in-out;
  position: absolute;
}

/* Transitions for buttons */
button {
  transition: all 0.3s ease;
}

/* Enhance active button effect */
button.bg-gradient-to-r {
  transform: translateY(-1px);
}
</style>