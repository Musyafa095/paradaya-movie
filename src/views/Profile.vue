<template>
  <Default>
    <section class="w-full">
      <div class="p-10 flex flex-col">
        <div class="avatar mx-auto">
          <div class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img
              v-if="store.currentUser?.profile?.image"
              :src="store.currentUser.profile.image"
              alt="Profile Image"
            />
            <img v-else src="https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png" alt="Default Profile Image" />
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-4 w-9/12 flex flex-col gap-2 mx-auto">
          <div class="mb-1">
            <label class="block text-xl font-bold mb-2">Age</label>
            <input
              type="number"
              placeholder="Type here"
              class="input input-bordered w-full bg-white border-blue-400 mb-2"
              v-model="payload.age"
              min="1"
            />
          </div>
          <div class="mb-2">
            <label class="block text-xl font-bold mb-2">Bio</label>
            <textarea
              v-model="payload.bio"
              placeholder="Type here"
              class="textarea bg-white border-blue-400 w-full"
            ></textarea>
          </div>
          <div class="mb-2">
            <input
              type="file"
              class="file-input file-input-ghost bg-white border-black w-full"
              @change="handleImage"
            />
          </div>

          <div class="w-full text-center">
            <button type="submit" class="btn w-full bg-blue-600" :disabled="isLoading">
              {{ isLoading ? "Uploading..." : "Submit" }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </Default>
</template>

<script setup>
import Default from "@/layouts/Default.vue";
import { authStore } from "@/stores/auth";
import { onMounted, reactive, ref } from "vue";

const isLoading = ref(false);
const store = authStore();
const payload = reactive({
  age: null,
  bio: "",
  image: null,
});

const handleImage = (e) => {
  const selectedFile = e.target.files[0] || null;
  payload.image = selectedFile;
};

const handleSubmit = async () => {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("age", payload.age || ""); // Menghindari 0 jika kosong
  formData.append("bio", payload.bio);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  try {
    await store.uploadProfile(formData);
    await store.getUserLogged();
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await store.getUserLogged();
  if (store.currentUser?.profile) {
    payload.age = store.currentUser.profile.age || "";
    payload.bio = store.currentUser.profile.bio || "";
  }
});
</script>
