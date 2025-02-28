<template>
  <div 
    class="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 dark:shadow-gray-700 dark:hover:shadow-gray-600"
    v-for="data in dataProps"
    :key="data.id"
  >
    <figure class="w-full h-48 overflow-hidden">
      <img
        :src="data.image"
        :alt="data.title"
        class="w-full h-full object-cover transition-all duration-300 hover:scale-105"
        loading="lazy"
      />
    </figure>
    <div class="card-body light:text-gray-800">
      <h2 class="card-title line-clamp-2 text-lg font-semibold leading-tight">{{ data.title }}</h2>
      <p class="text-sm light:text-gray-600 capitalize font-roboto">{{ formatDate(data.date) }}</p>
      <div class="card-actions justify-end mt-2"> 
        <RouterLink :to="`/news/${data.id}`" class="btn btn-info hover:btn-primary">
          Baca Selengkapnya
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";


const props = defineProps({
  dataProps: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const formatDate = (date) => {
  try {
    return new Intl.DateTimeFormat("id-ID", { 
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
};
</script>