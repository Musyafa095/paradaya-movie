<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-semibold font-roboto text-center my-4 ">Halaman Genre📝</h1>
    <section class="my-3" v-show="inputAction">
      <h2 class="text-lg font-bold font-montserrat">{{ isEdit ? "Edit" : "Tambah" }} Genre</h2>
      <form @submit.prevent="actionGenre">
        <input
          type="text"
          placeholder="Masukan nama genre"
          class="input input-bordered w-full mt-2"
          v-model="nameGenre"
        />
        <div class="flex gap-5 mt-3">
          <button class="btn btn-info flex-1">
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
    <section>
      <div class="flex justify-between items-center my-5">
        <h2 class="text-lg font-bold font-roboto">List Genre</h2>
        <button
          @click="tambahForm"
          class="btn btn-success btn-sm px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="genreData.length === 0">
              <td colspan="3" class="text-center">No Genre available</td>
            </tr>
            <tr v-for="(item, key) in genreData" :key="item.id" class="hover:bg-gray-50 font-bold font-sans" >
              <th>{{ key + 1 }}</th>
              <td>{{ item.name }}</td>
              <td class="flex gap-5">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { apiClient } from "@/config/api";
import { authStore } from "@/stores/auth";

// State Management
const store = authStore();
const nameGenre = ref("");
const inputAction = ref(false);
const genreData = ref([]);
const isEdit = ref(false);
const id = ref(null);

// Functions
const fetchGenre = async () => {
  try {
    const { data } = await apiClient.get("/genre");
    genreData.value = data.data || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    store.showNotification("Gagal mengambil data genre. Silakan coba lagi.");
  }
};

const tambahForm = () => {
  clearInputForm();
  inputAction.value = true;
};

const closeForm = () => {
  clearInputForm();
  inputAction.value = false;
};

const clearInputForm = () => {
  nameGenre.value = "";
  isEdit.value = false;
  id.value = null;
};

const handleEdit = (item) => {
  inputAction.value = true;
  isEdit.value = true;
  id.value = item.id;
  nameGenre.value = item.name;
};

const handleDelete = async (itemId) => {
  if (!confirm("Apakah anda yakin ingin menghapus genre ini 🤔?")) return;
  try {
    const response = await apiClient.post(`/genre/${itemId}?_method=DELETE`, null,{
      headers : {
        Authorization: `Bearer ${store.token}`
      }
    });
    store.showNotification("Berhasil menghapus genre.");
    await fetchCategory();
  } catch (error) {
    console.error("Error deleting genre:", error);
    store.showNotification("Gagal menghapus genre, silahkan coba lagi.");
  }
};

const actionGenre = async () => {
  try {
    let response;

    if (isEdit.value) {
      response = await apiClient.post(
        `/genre/${id.value}?_method=PUT`,
        { name: nameGenre.value },
        {
          headers: { Authorization: `Bearer ${store.token}` },
        }
      );
      store.showNotification("Genre berhasil diupdate.");
    } else {
      response = await apiClient.post(
        "/genre",
        { name: nameGenre.value },
        {
          headers: { Authorization: `Bearer ${store.token}` },
        }
      );
      store.showNotification("Genre berhasil ditambahkan.");
    }

    await fetchGenre(); 
    closeForm(); 
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response);
      store.showNotification(error.response.data.message || "An error occurred.");
    } else {
      console.error("Error:", error);
      store.showNotification("Failed to save category. Please check your network or try again later.");
    }
  }
};

// Lifecycle Hook
onMounted(fetchGenre);
</script>

<style scoped>
@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }
  .table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  .btn {
    padding: 0.5rem 1rem;
  }
}
</style>