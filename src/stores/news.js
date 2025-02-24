import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useNewsStore = defineStore("news", () => {
  const news = ref([]);
  const newsDetail = ref(null); 
  const comments = ref([]); 
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1); 
  const totalNewsCount = ref(0);  

  // Mengambil semua berita
  const getNews = async (page = 1, categoryId = null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const url = categoryId
      ? `/news?page=${page}&per_page=8&category=${categoryId}`
      : `/news?page=${page}&per_page=8`;
      const response = await apiClient.get(url);
      news.value = response.data.data.data || [];
      currentPage.value = response.data.data.current_page || 1;
      totalPages.value = response.data.data.last_page || 1;
      totalNewsCount.value = response.data.data.total|| 0;   
      } catch (err) {
      error.value = err.message || "Gagal mengambil data berita";
      console.error("Error fetching news:", err);
      news.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Mengambil detail berita berdasarkan ID
  const getNewsById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/news/${id}`);
      if (!response.data || !response.data.data) {
        throw new Error("Berita tidak ditemukan");
      }
      newsDetail.value = response.data.data;
      comments.value = response.data.data.comments || [];
      return newsDetail.value;
    } catch (err) {
      error.value = err.message || "Gagal mengambil detail berita";
      console.error("Error fetching news detail:", err);
      newsDetail.value = null; // 
      comments.value = [];
      throw err; // Lempar error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  };
    return { 
    news, 
    newsDetail, 
    comments,
    isLoading, 
    error, 
    getNews, 
    getNewsById, 
    totalPages,
    currentPage,
    totalNewsCount
  };
});