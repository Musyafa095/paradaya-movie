import { ref } from "vue";
import { defineStore } from "pinia";
import { apiClient } from "@/config/api";

export const useNewsStore = defineStore("news", () => {
  const news = ref([]);

  const getNews = async () => {
    try {
      const response = await apiClient.get("/news");
      news.value = response.data.data.data;
      return response.data.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNewsById = async (id) => {
    try {
      const response = await apiClient.get(`/news/${id}`);
      return response.data.data;
    } catch (error) {}
  };

  return { news, getNews, getNewsById };
});
