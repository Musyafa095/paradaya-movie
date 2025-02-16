<template>
  <section class="min-h-screen flex flex-col" data-them="light">
    <NavbarDaisy />
    <main class="flex-1 bg-base-100">
      <slot></slot>
    </main>
  </section>
</template>

<script setup>
import NavbarDaisy from "@/components/NavbarDaisy.vue";



</script>
