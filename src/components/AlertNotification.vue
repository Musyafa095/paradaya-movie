<!-- AlertNotification.vue -->
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-3 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-3 opacity-0"
  >
    <div 
      v-if="auth.showAlert" 
      class="alert shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 w-96 z-50 animate-fade-in"
    >
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="ml-2">{{ auth.alertMessage }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { authStore } from "@/stores/auth";
const auth = authStore();
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -1rem);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>