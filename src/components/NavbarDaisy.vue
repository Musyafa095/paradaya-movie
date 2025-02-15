<template>
  <div class="navbar bg-base-100">
    <div class="flex-1 text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-800 to-blue-700 text-transparent bg-clip-text">
      <a class="btn btn-ghost text-xl">ParadaNews.com</a>
    </div>

    <div class="flex-none gap-2">
      <!-- Search untuk desktop -->
      <div class="hidden sm:flex items-center border border-gray-400 rounded-lg px-4 py-2 w-96 mr-2">
        <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.5-1.5m-1.5 1.5l4.35 4.35" />
        </svg>
        <input
          type="text"
          v-model="searchStore.searchQuery"
          class="ml-2 w-full focus:outline-none bg-transparent"
          placeholder="Cari Berita Disini..."
        />
      </div>

      <!-- Search untuk mobile -->
      <div class="relative sm:hidden">
        <button @click="toggleSearch" class="btn btn-ghost btn-circle">
          <svg class="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.5-1.5m-1.5 1.5l4.35 4.35" />
          </svg>
        </button>
        
        <!-- Overlay input untuk mobile -->
        <div v-if="isMobileSearchOpen" 
             class=" absolute top-0 right-0 mx-5 w-96 px-4 py-2 shadow-lg z-50">
          <div class="flex items-center border border-gray-400 rounded-lg px-3 py-1 bg-white">
            <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.5-1.5m-1.5 1.5l4.35 4.35" />
            </svg>
            <input
              type="text"
              v-model="searchStore.searchQuery"
              class="ml-2 w-full focus:outline-none bg-transparent pl-2"
              placeholder="Cari Berita Disini..."
            />
          </div>
        </div>
      </div>

      <!-- Profile dropdown -->
      <div class="dropdown dropdown-end"
      @click="toggleProfileDropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Profile"
              src="https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png"
            />
          </div>
        </div>
        <ul
          v-if="isProfileDropdownOpen"
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSearchStore } from '@/stores/search';

const searchStore = useSearchStore();
const isMobileSearchOpen = ref(false);
const isProfileDropdownOpen = ref(false);

const toggleSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value;
};
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

</script>