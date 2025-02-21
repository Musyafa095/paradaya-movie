import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useNewsStore = defineStore("news", () => {
  const news = ref([]); // List berita
  const newsDetail = ref(null); // Detail berita
  const comments = ref([]); // List komentar
  const isLoading = ref(false);
  const error = ref(null);

  // Mengambil semua berita
  const getNews = async (categoryId = null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const url = categoryId ? `/news?category=${categoryId}` : "/news";
      const response = await apiClient.get(url);
      news.value = response.data.data.data || []; // Pastikan tidak undefined
    } catch (err) {
      error.value = err.message || "Gagal mengambil data berita";
      console.error("Error fetching news:", err);
      news.value = []; // Pastikan news tidak kosong saat error
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
      
      // Pastikan respons API memiliki struktur yang benar
      if (!response.data || !response.data.data) {
        throw new Error("Berita tidak ditemukan");
      }
  
      // Simpan data ke newsDetail
      newsDetail.value = response.data.data;
      return response.data.data; 
    } catch (err) {
      error.value = err.message || "Gagal mengambil detail berita";
      console.error("Error fetching news detail:", err);
      newsDetail.value = null; // Pastikan null saat gagal
      throw err; // Lempar error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  };

  // Mengambil komentar berdasarkan news_id
  const getCommentsByNewsId = async (newsId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/comments?news_id=${newsId}`);
      
      // Pastikan respons API memiliki struktur yang benar
      if (!response.data || !response.data.data) {
        throw new Error("Komentar tidak ditemukan");
      }

      comments.value = response.data.data; // Simpan komentar
      return comments.value; // Kembalikan data komentar
    } catch (err) {
      error.value = err.message || "Gagal mengambil komentar";
      console.error("Error fetching comments:", err);
      throw err; // Lempar error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  };

  // Mengirim komentar
  const uploadComment = async (payload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post("/comments", payload);
      return response.data; // Kembalikan data komentar yang baru saja ditambahkan
    } catch (err) {
      error.value = err.message || "Gagal mengirim komentar";
      console.error("Error uploading comment:", err);
      throw err; // Lempar error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  };

  return { 
    news, 
    newsDetail, 
    comments, // Tambahkan ini agar bisa dipakai di komponen
    isLoading, 
    error, 
    getNews, 
    getNewsById, 
    getCommentsByNewsId, 
    uploadComment 
  };
});