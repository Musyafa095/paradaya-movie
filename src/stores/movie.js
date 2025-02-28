import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useMovieStore = defineStore("movie", () => {
  const movie = ref([]);
  const movieDetail = ref(null); 
  const reviews = ref([]); 
  const isLoading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1); 
  const totalMovieCount = ref(0);  

  const getMovie = async (page = 1, genreId = null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const url = genreId
      ? `/movie?page=${page}&per_page=12&genre=${genreId}`
      : `/movie?page=${page}&per_page=12`;
      const response = await apiClient.get(url);
      movie.value = response.data.data.data || [];
      currentPage.value = response.data.data.current_page || 1;
      totalPages.value = response.data.data.last_page || 1;
      totalMovieCount.value = response.data.data.total|| 0;   
      } catch (err) {
      error.value = err.message || "Gagal mengambil data movie";
      console.error("Error fetching movies:", err);
      movie.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const getMovieById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(`/movie/${id}`);
      if (!response.data || !response.data.data) {
        throw new Error("Movie tidak ditemukan");
      }
      movieDetail.value = response.data.data;
      reviews.value = response.data.data.reviews || [];
      return movieDetail.value;
    } catch (err) {
      error.value = err.message || "Gagal mengambil detail movie";
      console.error("Error fetching movie detail:", err);
      movieDetail.value = null; // 
      reviews.value = [];
      throw err; // Lempar error agar bisa ditangkap di komponen
    } finally {
      isLoading.value = false;
    }
  };
    return { 
    movie, 
    movieDetail, 
    reviews,
    isLoading, 
    error, 
    getMovie, 
    getMovieById, 
    totalPages,
    currentPage,
    totalMovieCount
  };
});