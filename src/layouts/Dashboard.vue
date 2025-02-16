<template>
  <section class="h-screen flex">
    <Sidebar />
    <div class="flex flex-col flex-grow">
      <Navbar />

      <main class="flex-grow p-4 bg-gray-100">
        <slot />
      </main>
    </div>
  </section>
</template>

<script setup>
import Sidebar from "@/components/Admin/Sidebar.vue";
import Navbar from "@/components/Admin/Navbar.vue";
</script>
