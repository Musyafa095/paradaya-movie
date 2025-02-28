<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-semibold font-roboto text-center my-4">Halaman News 📰</h1>

    <!-- Form Section -->
    <section class="my-3" v-show="inputAction">
      <h2 class="text-lg text-info font-bold">{{ isEdit ? "Edit" : "Tambah" }} News</h2>
      <form @submit.prevent="actionNews" class="space-y-4 mt-2">
        <input
          type="text"
          placeholder="Masukan judul berita"
          class="input input-bordered w-full"
          v-model="newsData.title"
          required
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            class="input input-bordered w-full"
            v-model="newsData.date"
            required
          />
          
          <select 
            class="select select-bordered w-full" 
            v-model="newsData.category_id"
            required
          >
            <option disabled value="">Select category</option>
            <option 
              v-for="item in categoryList" 
              :key="item.id" 
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <textarea
          placeholder="Masukan konten berita"
          class="textarea textarea-bordered w-full h-32"
          v-model="newsData.content"
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
            v-if="imagePreview" 
            :src="imagePreview" 
            alt="Preview" 
            class="w-32 h-32 object-cover rounded-lg"
          />
        </div>

        <div class="flex gap-5">
          <button 
            class="btn btn-info flex-1"
            :disabled="newsStore.isLoading"
          >
            <span v-if="newsStore.isLoading" class="loading loading-spinner loading-sm"></span>
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

    <!-- News List Section -->
    <section>
      <div class="flex justify-between items-center my-5">
        <h2 class="text-lg font-bold text-info">List News</h2>
        <button
          @click="tambahForm"
          class="btn btn-success btn-sm px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="newsStore.isLoading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="newsStore.error" class="alert alert-error">
        {{ newsStore.error }}
      </div>

      <!-- News Grid -->
     <!-- News Grid -->
<div v-else>
  <div v-if="newsStore.news.length === 0" class="text-center py-4">
    No news available
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div 
      v-for="(item, key) in newsStore.news" 
      :key="item.id"
      class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden ease-in-out hover:scale-105"
    >
      <figure class="px-4 pt-4">
        <img 
          :src="item.image" 
          :alt="item.title"
          class="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div class="card-body p-4 h-auto flex flex-col">
        <h2 class="card-title text-base font-bold line-clamp-2">
          {{ item.title }}
        </h2>
        <p class="text-sm light:text-gray-500">{{ item.date }}</p>
        <p class="text-sm light:text-gray-700 line-clamp-3 font-montserrat ">
          {{ item.content }}
        </p>
        <div class="card-actions justify-end mt-auto flex gap-2">
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
    </section>
    <div class="join flex justify-center items-center mt-4">
  <button class="join-item btn btn-info"
  @click="changePage(currentPage - 1)" 
  :disabled="currentPage === 1"
  >« Prev</button>
  <button class="join-item btn">Halaman {{ currentPage }}{{ totalPages }}</button>
  <button class="join-item btn btn-secondary"
  @click="changePage(currentPage + 1)"
  :disabled="currentPage === totalPages"
  >Next »</button>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { apiClient } from "@/config/api";
import { authStore } from "@/stores/auth";
import { useNewsStore } from "@/stores/movie";
import { useCategoryStore } from "@/stores/genre";


const store = authStore();
const newsStore = useNewsStore();
const categoryStore = useCategoryStore();
const categoryList = ref([]);
const fileInput = ref(null);
const imagePreview = ref(null);
const currentPage = ref(1);

const newsData = ref({
  title: "",
  date: "",
  content: "",
  image: null,
  category_id: ""
});
const inputAction = ref(false);
const isEdit = ref(false);
const id = ref(null);

const fetchNews = async () => {
  try {
    await newsStore.getNews(currentPage.value);
  } catch (error) {
    console.error("Error fetching news:", error);
    alert("Failed to fetch news. Please try again later.");
  }
};

const fetchCategories = async () => {
  try {
    categoryList.value = await categoryStore.getCategory();
  } catch (error) {
    console.error("Error fetching categories:", error);
    store.showNotification("Gagal memuat kategori, silahkan coba lagi.");
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    newsData.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    alert("File harus berupa gambar.");
    newsData.value.image = null;
    imagePreview.value = null;
  }
};

const clearInputForm = () => {
  newsData.value = {
    title: "",
    date: "",
    content: "",
    image: null,
    category_id: ""
  };
  isEdit.value = false;
  id.value = null;
  imagePreview.value = null;
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
  newsData.value = {
    title: item.title,
    date: item.date,
    content: item.content,
    image: null,
    category_id: item.category_id
  };
  imagePreview.value = item.image;
  fetchCategories(); // Refresh categories when editing
};

const handleDelete = async (itemId) => {
  if (!confirm("Apakah anda yakin ingin menghapus berita ini?")) return;
  try {
    await apiClient.delete(`/news/${itemId}`, {
      headers: { Authorization: `Bearer ${store.token}` },
    });
    store.showNotification("Berita berhasil dihapus.");
    await fetchNews();
  } catch (error) {
    console.error("Error deleting news:", error);
    store.showNotification("Gagal menghapus berita, silahkan coba lagi.");
  }
};

const actionNews = async () => {
  try {
    const formData = new FormData();
    formData.append('title', newsData.value.title);
    formData.append('date', newsData.value.date);
    formData.append('content', newsData.value.content);
    formData.append('category_id', newsData.value.category_id);
    if (newsData.value.image instanceof File) {
      formData.append('image', newsData.value.image);
    }

    if (isEdit.value) {
      await apiClient.post(
        `/news/${id.value}?_method=PUT`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${store.token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      store.showNotification("Berita berhasil diupdate.");
    } else {
      await apiClient.post(
        "/news",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${store.token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      store.showNotification("Berita berhasil dibuat.");
    }

    await fetchNews();
    closeForm();
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response);
      alert(error.response.data.message || "An error occurred.");
    } else {
      console.error("Error:", error);
      store.showNotification("Gagal menyimpan berita, silahkan coba lagi.");
    }
  }
};
const changePage = (page) => {
  if (page >= 1 && page <= newsStore.totalPages) {
    currentPage.value = page;
    fetchNews();
  }
};
watch (currentPage, fetchNews);


onMounted(async () => {
  await Promise.all([fetchNews(), fetchCategories()]);
});
</script>