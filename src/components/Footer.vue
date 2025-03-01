<template>
  <footer class="footer-container bg-gray-900 text-gray-300 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
        <!-- Categories -->
        <div class="footer-section">
          <h3 class="font-bold mb-4 text-lg">Movie</h3>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category">
              {{ category }}
            </li>
          </ul>
        </div>

        <!-- Watch & Listen -->
        <div class="footer-section col-span-2">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-bold mb-3 text-lg">Tonton</h4>
              <ul class="space-y-2">
                <li>TV Langsung</li>
                <li>paradayNews Cepat</li>
                <li>Acara A-Z</li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold mb-3 text-lg">Tentang Kami</h4>
              <ul class="space-y-2">
                <li>Redaksi</li>
                <li>Karir</li>
                <li>Kontak</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t pt-6 mt-8 border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <div class="flex space-x-4 text-sm mb-4 md:mb-0">
          <a v-for="link in legalLinks" :key="link" class="hover:underline">
            {{ link }}
          </a>
        </div>
        <div class="text-sm">© {{ currentYear }} AnimeFlix.com. Seluruh hak cipta dilindungi.</div>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a href="#" class="text-gray-400 hover:text-white">
            <i class="fab fa-facebook text-xl"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <i class="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" class="text-gray-400 hover:text-white">
            <i class="fab fa-instagram text-xl"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      categories: ['Nasional', 'Internasional', 'Ekonomi', 'Olahraga', 'Teknologi', 'Gaya Hidup'],
      legalLinks: ['Syarat Penggunaan', 'Kebijakan Privasi', 'Pengaturan Cookie'],
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer-container {
  color: var(--text-color);
  background-color: var(--bg-color);
}

.footer-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
