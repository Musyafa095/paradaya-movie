<template>
  <section class="min-h-screen flex flex-col" data-them="light">
    <NavbarDaisy />
    <AlertNotification />
    <main class="flex-1 bg-base-100">
      <slot></slot>
    </main>
    <Footer/>
  </section>
</template>

<script setup>
import NavbarDaisy from "@/components/NavbarDaisy.vue";
import AlertNotification from "@/components/AlertNotification.vue";
import Footer from "@/components/Footer.vue";

</script>
