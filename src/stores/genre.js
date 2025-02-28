import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useGenreStore = defineStore("genre", () => {
  const genre = ref([]);
  const genreId = ref(null);

  const getGenre = async () => {
    try {
      const response = await apiClient.get("/genre");
      genre.value = response.data.data;
      return response.data.data;
    } catch (error) {
      console.error("Error fetching genres:", error.message);
      return []; 
    }
  };

  const getGenreDetail = async (id) => {
    try {
      const response = await apiClient.get(`/genre/${id}`);
      genreId.value = response.data.data;
      return genreId.value;
    } catch (error) {
      console.error("Error fetching genre detail:", error.message);
      return null; 
    }
  };

  return { genre, genreId, getGenre, getGenreDetail,  };
});
