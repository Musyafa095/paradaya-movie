import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useNewsStore = defineStore("news", () => {
  const news = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const getNews = async (categoryId = null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const url = categoryId ? `/news?category=${categoryId}` : "/news";
      const response = await apiClient.get(url);
      news.value = response.data.data.data;
      return response.data.data;
    } catch (err) {
      error.value = err.message || "Gagal mengambil data berita";
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  const getNewsById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/news/${id}`);
      return response.data.data;
    } catch (err) {
      error.value = err.message || "Gagal mengambil detail berita";
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return { 
    news, 
    isLoading, 
    error, 
    getNews, 
    getNewsById 
  };
});