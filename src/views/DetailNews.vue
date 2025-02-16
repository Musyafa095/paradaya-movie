<template>
  <Default>
    <div class="px-4 py-4 flex justify-center">
      <div class="card bg-base-100 w-96 shadow-xl">
        <figure class="h-[400px]">
          <img
            :src="newsDetail.image"
            :alt="newsDetail.title"
            class="object-cover"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ newsDetail.title }}</h2>
          <span class="badge badge-secondary">{{ newsDetail.year }}</span>
          <p>{{ newsDetail.content }}</p>
        </div>
      </div>
    </div>
  </Default>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useNewsStore } from "@/stores/news";
import Default from "@/layouts/Default.vue";
import { apiClient } from "@/config/api";

const route = useRoute();
const id = route.params.id;
const stores = useNewsStore();
const newsDetail = ref({});

onMounted(async () => {
  newsDetail.value = await stores.getNewsById(id);
});
</script>
