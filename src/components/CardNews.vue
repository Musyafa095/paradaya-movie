<template>
  <div
    class="card card-compact bg-base-100 md:w-90 sm:w-full shadow-xl gap-4"
    v-for="data in dataProps"
    :key="data.id"
  >
    <figure class="w-full h-[260px]">
      <img :src="data.image" alt="Shoes" class="w-full h-full object-cover" />
    </figure>
    <div class="card-body">
      <h2 class="card-title capitalize font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent  ">{{ data.name }}</h2>
      <p>{{ data.title }}</p>
      <p>{{ formatter.format(data.year) }}</p>
      <div class="card-actions justify-end">
        <RouterLink :to="`/news/${data.id}`" class="btn btn-primary"
          >Selengkapnya</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatter } from "@/utils/formatted";
import { RouterLink } from "vue-router";
const props = defineProps({
  dataProps: {
    type: Array,
    default: [],
  },
});
</script>
