<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-semibold font-roboto text-center my-4">Halaman Category📝</h1>
    <section class="my-3" v-show="inputAction">
      <h2 class="text-lg text-info font-montserrat">{{ isEdit ? "Edit" : "Tambah" }} Category</h2>
      <form @submit.prevent="actionCategory">
        <input
          type="text"
          placeholder="Masukan nama category"
          class="input input-bordered w-full mt-2"
          v-model="nameCategory"
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
        <h2 class="text-lg font-bold text-info">List Category</h2>
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
            <tr v-if="categoryData.length === 0">
              <td colspan="3" class="text-center">No categories available</td>
            </tr>
            <tr v-for="(item, key) in categoryData" :key="item.id" class="hover:bg-gray-50 font-bold font-sans" >
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
const nameCategory = ref("");
const inputAction = ref(false);
const categoryData = ref([]);
const isEdit = ref(false);
const id = ref(null);

// Functions
const fetchCategory = async () => {
  try {
    const { data } = await apiClient.get("/category");
    categoryData.value = data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert("Failed to fetch categories. Please try again later.");
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
  nameCategory.value = "";
  isEdit.value = false;
  id.value = null;
};

const handleEdit = (item) => {
  inputAction.value = true;
  isEdit.value = true;
  id.value = item.id;
  nameCategory.value = item.name;
};

const handleDelete = async (itemId) => {
  if (!confirm("Are you sure you want to delete this category?")) return;
  try {
    const response = await apiClient.post(`/category/${itemId}?_method=DELETE`, null,{
      headers : {
        Authorization: `Bearer ${store.token}`
      }
    });
    alert(response.data.message || "Category deleted successfully.");
    await fetchCategory();
  } catch (error) {
    console.error("Error deleting category:", error);
    alert("Failed to delete category. Please try again later.");
  }
};

const actionCategory = async () => {
  try {
    let response;

    if (isEdit.value) {
      // Update existing category
      response = await apiClient.post(
        `/category/${id.value}?_method=PUT`,
        { name: nameCategory.value },
        {
          headers: { Authorization: `Bearer ${store.token}` },
        }
      );
      alert(response.data.message || "Category updated successfully.");
    } else {
      // Create new category
      response = await apiClient.post(
        "/category",
        { name: nameCategory.value },
        {
          headers: { Authorization: `Bearer ${store.token}` },
        }
      );
      alert(response.data.message || "Category added successfully.");
    }

    await fetchCategory(); // Refresh data setelah operasi berhasil
    closeForm(); // Tutup form
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response);
      alert(error.response.data.message || "An error occurred.");
    } else {
      console.error("Error:", error);
      alert("Failed to save category. Please check your network or try again later.");
    }
  }
};

// Lifecycle Hook
onMounted(fetchCategory);
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