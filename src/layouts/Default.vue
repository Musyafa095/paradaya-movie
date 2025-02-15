<template>
  <section class="min-h-screen flex flex-col">
    <NavbarDaisy />
    <main class="flex-1 bg-white">
      <slot></slot>
    </main>
  </section>
</template>

<script setup>
import NavbarDaisy from "@/components/NavbarDaisy.vue";


</script>
