<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-semibold font-roboto text-center my-4">Halaman Movie 🎬</h1>

    <!-- Form Section -->
    <section class="my-3" v-show="inputAction">
      <h2 class="text-lg text-info font-bold">{{ isEdit ? "Edit" : "Tambah" }} Movie</h2>
      <form @submit.prevent="actionMovie" class="space-y-4 mt-2">
        <input
          type="text"
          placeholder="Masukan judul movie"
          class="input input-bordered w-full"
          v-model="movieData.title"
          required
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Tahun rilis"
            class="input input-bordered w-full"
            v-model="movieData.year"
            required
          />
          
          <select 
            class="select select-bordered w-full" 
            v-model="movieData.genre_id"
            required
          >
            <option disabled value="">Select genre</option>
            <option 
              v-for="item in genreList" 
              :key="item.id" 
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Link trailer (YouTube)"
          class="input input-bordered w-full"
          v-model="movieData.trailer_url"
          required
        />

        <input
          type="text"
          placeholder="Link movie (Drive)"
          class="input input-bordered w-full"
          v-model="movieData.movie_url"
          required
        />

        <textarea
          placeholder="Masukan ringkasan film"
          class="textarea textarea-bordered w-full h-32"
          v-model="movieData.summary"
          required
        ></textarea>
        
        <div class="space-y-2">
          <input
            type="file"
            class="file-input file-input-bordered w-full"
            @change="handleImageUpload"
            accept="image/*"
            ref="fileInput"
            :required="!isEdit"
          />
          <img 
            v-if="posterPreview" 
            :src="posterPreview" 
            alt="Preview" 
            class="w-32 h-32 object-cover rounded-lg"
          />
        </div>

        <div class="flex gap-5">
          <button 
            class="btn btn-info flex-1"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            {{ isEdit ? "Edit" : "Tambah" }}
          </button>
          <button
            class="btn btn-error flex-1"
            type="button"
            @click="closeForm"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- Movie List Section -->
    <section>
      <div class="flex justify-between items-center my-5">
        <h2 class="text-lg font-bold text-info">List Movies</h2>
        <button
          @click="tambahForm"
          class="btn btn-success btn-sm px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Movie Grid -->
      <div v-else>
        <div v-if="!movies || movies.length === 0" class="text-center py-4">
          No movies available
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div v-for="(item, key) in movies" :key="item?.id">
            <div v-if="item" class="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
            <figure class="px-4 pt-4">
              <img 
                :src="item.poster" 
                :alt="item.title"
                class="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div class="card-body p-4 h-auto flex flex-col">
              <h2 class="card-title text-base font-bold line-clamp-2">
                {{ item.title }}
              </h2>
              <p class="text-sm light:text-gray-500">{{ item.year }}</p>
              <p class="text-sm light:text-gray-700 line-clamp-3 font-montserrat">
                {{ item.summary }}
              </p>
              <div class="card-actions justify-center mt-2 flex gap-2">
                <button
                  class="btn btn-info btn-sm"
                  @click="handleEdit(item)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-secondary btn-sm"
                  @click="handleDelete(item.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
    <div class="join flex justify-center items-center mt-4">
      <button 
        class="join-item btn btn-info"
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        « Prev
      </button>
      <button class="join-item btn">Halaman {{ currentPage }} / {{ totalPages }}</button>
      <button 
        class="join-item btn btn-secondary"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next »
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { apiClient } from "@/config/api";
import { authStore } from "@/stores/auth";
import { useMovieStore } from "@/stores/movie";
import { useGenreStore } from "@/stores/genre";

const store = authStore();
const movieStore = useMovieStore();
const genreStore = useGenreStore();
const genreList = ref([]);
const fileInput = ref(null);
const posterPreview = ref(null);
const currentPage = ref(1);
const isLoading = ref(false);
const error = ref(null);
const movies = ref([]);
const totalPages = ref(1);

const movieData = ref({
  title: "",
  year: "",
  summary: "",
  poster: null,
  trailer_url: "",
  movie_url: "",
  genre_id: ""
});
const inputAction = ref(false);
const isEdit = ref(false);
const id = ref(null);

const fetchMovie = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await movieStore.getMovie(currentPage.value); // Ambil data dari store
    movies.value = movieStore.movie; // Sinkronkan dengan data di store
    totalPages.value = movieStore.totalPages; // Gunakan total halaman dari store
  } catch (err) {
    console.error("Error fetching movies:", err);
    error.value = "Failed to fetch movies.";
    movies.value = [];
  } finally {
    isLoading.value = false;
  }
};


const fetchGenres = async () => {
  try {
    await genreStore.getGenre(); // Ambil data genre dari store
    genreList.value = genreStore.genre; // Sinkronkan dengan data di store
  } catch (error) {
    console.error("Error fetching genres:", error);
    store.showNotification("Gagal memuat kategori, silahkan coba lagi.");
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    movieData.value.poster = file;
    posterPreview.value = URL.createObjectURL(file);
  } else {
    alert("File harus berupa gambar poster.");
    movieData.value.poster = null;
    posterPreview.value = null;
  }
};

const clearInputForm = () => {
  movieData.value = {
    title: "",
    year: "",
    summary: "",
    trailer_url: "",
    movie_url: "",
    poster: null,
    genre_id: ""
  };
  isEdit.value = false;
  id.value = null;
  posterPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const tambahForm = () => {
  inputAction.value = true;
  clearInputForm();
};

const closeForm = () => {
  inputAction.value = false;
  clearInputForm();
};

const handleEdit = (item) => {
  inputAction.value = true;
  isEdit.value = true;
  id.value = item.id;
  movieData.value = {
    title: item.title,
    year: item.year,
    summary: item.summary,
    trailer_url: item.trailer_url,
    movie_url: item.movie_url,
    poster: null,
    genre_id: item.genre_id
  };
  posterPreview.value = item.poster;
  fetchGenres(); 
};

const handleDelete = async (itemId) => {
  if (!confirm("Apakah anda yakin ingin menghapus movie ini?")) return;
  try {
    await apiClient.delete(`/movie/${itemId}`, {
      headers: { Authorization: `Bearer ${store.token}` },
    });
    store.showNotification("Movie berhasil dihapus.");
    await fetchMovie();
  } catch (error) {
    console.error("Error deleting movie:", error);
    store.showNotification("Gagal menghapus movie, silahkan coba lagi.");
  }
};

const actionMovie = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', movieData.value.title);
    formData.append('year', movieData.value.year);
    formData.append('summary', movieData.value.summary);
    formData.append('trailer_url', movieData.value.trailer_url);
    formData.append('movie_url', movieData.value.movie_url);
    formData.append('genre_id', movieData.value.genre_id);
    if (movieData.value.poster instanceof File) {
      formData.append('poster', movieData.value.poster);
    }

    if (isEdit.value) {
      await apiClient.post(
        `/movie/${id.value}?_method=PUT`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${store.token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      store.showNotification("Movie berhasil diupdate.");
    } else {
      await apiClient.post(
        "/movie",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${store.token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      store.showNotification("Movie berhasil dibuat.");
    }

    await fetchMovie();
    closeForm();
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response);
      alert(error.response.data.message || "An error occurred.");
    } else {
      console.error("Error:", error);
      store.showNotification("Gagal menyimpan movie, silahkan coba lagi.");
    }
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMovie();
  }
};

watch(currentPage, fetchMovie);

onMounted(async () => {
  await Promise.all([fetchMovie(), fetchGenres()]);
});
</script>