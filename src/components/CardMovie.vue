<template>
  <div
    class="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden dark:shadow-gray-700 dark:hover:shadow-gray-600"
    v-for="data in dataProps"
    :key="data.id"
  >
    <!-- Gambar Movie -->
    <figure class="w-full h-56 overflow-hidden">
      <img
        :src="data.poster"
        :alt="data.title"
        class="w-full h-full object-cover transition-all duration-300 hover:scale-105"
        loading="lazy"
      />
    </figure>

    <!-- Konten Movie -->
    <div class="card-body light:text-gray-800 p-4">
      <h2 class="text-xl font-bold font-montserrat leading-tight line-clamp-2">
        {{ data.title }}
      </h2>
      <p class="text-sm light:text-gray-500 font-inter">
        📅 {{ data.year }}
      </p>
      <div class="card-actions justify-center mt-3 flex gap-2">
        <button
          @click="toggleTrailer(data.id)"
          class="btn btn-secondary hover:btn-primary transition-all duration-300 shadow-md"
        >
          🎥 Watch Trailer
        </button>

        <RouterLink :to="`/movie/${data.id}`" class="btn btn-info hover:bg-cyan-500 transition-all duration-300 shadow-md">
          🎬 Watch Movie
        </RouterLink>
      </div>
    </div>

    <!-- Modal Popup -->
    <Teleport to="body">
      <div
        v-if="showTrailer[data.id]"
        class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      >
        <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
          <button
            @click="toggleTrailer(data.id)"
            class="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-xl hover:text-red-500"
          >
            ✖
          </button>
          <h3 class="text-lg font-bold mb-3 text-gray-400">{{ data.title }} - Trailer</h3>
          <iframe
            v-if="data.trailer_url"
            class="w-full aspect-video rounded-lg"
            :src="data.trailer_url"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <p v-else class="text-center text-gray-500 dark:text-gray-400 mt-4">
            🚫 Trailer tidak tersedia
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  dataProps: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// State untuk menampilkan modal trailer
const showTrailer = ref({});

const toggleTrailer = (id) => {
  showTrailer.value[id] = !showTrailer.value[id];
};
</script>
