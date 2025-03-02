<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-base-content">Frequently Asked Questions 📢</h1>
      
      <!-- Enhanced Search FAQ -->
      <div class="mb-8">
        <div class="form-control">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari pertanyaan seputar animeflix..." 
            class="input input-bordered w-full bg-base-100 border-2 transition-all duration-300 shadow-sm
            hover:border-primary focus:border-primary focus:shadow-md focus:outline-none
            dark:bg-base-200 dark:border-base-300 dark:hover:border-primary"
          />
        </div>
      </div>

      <!-- FAQ Sections with Enhanced Styling -->
      <div class="space-y-6">
        <div v-for="(section, index) in filteredFAQs" :key="index">
          <h2 class="text-xl font-semibold mb-4 text-base-content">{{ section.category }}</h2>
          <div class="space-y-4">
            <div 
              v-for="(item, itemIndex) in section.items" 
              :key="itemIndex" 
              class="collapse collapse-arrow border-2 border-base-200 hover:border-base-300 
              bg-base-100 rounded-lg transition-all duration-200 
              hover:shadow-md dark:bg-base-200 dark:border-base-300 
              dark:hover:border-base-400"
            >
              <input type="radio" :name="'faq-' + index" /> 
              <div class="collapse-title text-lg font-medium text-base-content p-4">
                {{ item.question }}
              </div>
              <div class="collapse-content text-base-content/80 bg-base-100 dark:bg-base-200">
                <div class="pt-2 pb-4">
                  <p class="text-base">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredFAQs.length === 0" class="text-center py-8">
        <p class="text-base-content/70 text-lg">Tidak ada hasil yang ditemukan untuk "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQPage',
  data() {
    return {
      searchQuery: '',
      faqSections: [
        {
          category: 'Umum',
          items: [
            {
              question: 'Apa itu Portal Movie AnimeFlix?',
              answer: 'Portal Movie AnimeFlix adalah platform berbasis web yang menyediakan informasi tentang berbagai film anime. Pengguna dapat menemukan detail film, genre, serta memberikan ulasan atau komentar.'
            },
            {
              question: 'Bagaimana cara mengakses AnimeFlix?',
              answer: 'AnimeFlix dapat diakses melalui browser di perangkat apa pun yang terhubung ke internet. Cukup buka link web AnimeFlix dan login menggunakan akun yang sudah terdaftar.'
            },
            {
              question: 'Apakah konten Movie AnimeFlix dapat diakses secara gratis?',
              answer: 'Ya, semua konten film kami dapat diakses secara gratis. Kami tidak memerlukan pembayaran untuk mengakses konten ini.'
            }
          ]
        },
        {
          category: 'Akun & Pengaturan',
          items: [
            {
              question: 'Bagaimana cara membuat akun?',
              answer: 'Klik tombol "Login" di pojok kanan atas, isi formulir pendaftaran dengan data diri Anda, dan ikuti petunjuk verifikasi email yang akan dikirimkan.'
            },
            {
              question: 'Bagaimana cara mengupdate profile?',
              answer: 'Masuk ke navbar profil, klik menu "Profile", Isi bio, umur dan pilih foto. lalu klik tombol "Simpan" untuk menyimpan perubahan.'
            }
          ]
        },
        {
          category: 'Konten & Kategori',
          items: [
            {
              question: 'Berapa kali animeflix diperbarui?',
              answer: 'Kami memperbarui movie secara real-time setiap hari. Movie Anime terbaru akan muncul di halaman utama segera setelah dipublikasikan.'
            },
            {
              question: 'Bagaimana cara mencari movie anime berdasarkan genre?',
              answer: 'Gunakan menu genre di bagian atas atau header website untuk menjelajahi movie berdasarkan genre yang Anda minati.'
            },
            {
              question: 'Apakah saya bisa menyimpan movie anime untuk ditonton nanti?',
              answer: 'Belum, Mohon maaf kami belum menyediakan fitur bookmark untuk saat ini. kami akan kembangkan fitur ini nanti.'
            }
          ]
        },
        {
          category: 'Teknis',
          items: [
            {
              question: 'Apakah ada aplikasi mobile?',
              answer: 'Belum, Tapi Anda dapat mengakses ParadayaNews.com melalui browser desktop maupun mobile.'
            },
            {
              question: 'Bagaimana jika saya mengalami masalah teknis?',
              answer: 'Silakan hubungi tim support kami melalui email support@AnimeFlix.com yang tertera di footer website untuk mendapatkan bantuan teknis.'
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredFAQs() {
      if (!this.searchQuery) return this.faqSections;
      
      const query = this.searchQuery.toLowerCase();
      return this.faqSections.map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.question.toLowerCase().includes(query) || 
          item.answer.toLowerCase().includes(query)
        )
      })).filter(section => section.items.length > 0);
    }
  }
}
</script> 