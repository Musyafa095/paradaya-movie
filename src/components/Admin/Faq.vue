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
            placeholder="Cari pertanyaan..." 
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
              question: 'Apa itu Portal Berita ParadayaNews.com?',
              answer: 'Portal Berita ParadayaNews  adalah platform digital yang menyajikan berita terkini, akurat, dan terpercaya dalam berbagai kategori, seperti politik, ekonomi, teknologi, hiburan, dan olahraga. Dengan tampilan yang sederhana dan tentunya responsif, ParadayaNews dirancang untuk memberikan pengalaman membaca yang nyaman, baik dalam mode terang maupun gelap.Portal ini dikelola oleh tim admin yang bertugas untuk membuat, mengelola, dan mempublikasikan berita, sementara pengguna dapat membaca berita dan mengakses informasi dengan mudah. Dengan fokus pada kecepatan dan keterbacaan, Paradaya memastikan setiap berita disajikan dengan desain yang rapi, ringkas, dan informatif. 🚀'
            },
            {
              question: 'Bagaimana cara mengakses berita?',
              answer: 'Anda dapat mengakses berita melalui halaman utama website kami atau menggunakan menu kategori untuk menemukan berita berdasarkan topik yang Anda minati.'
            },
            {
              question: 'Apakah konten berita dapat diakses secara gratis?',
              answer: 'Ya, sebagian besar konten berita kami dapat diakses secara gratis. Namun, beberapa konten premium mungkin memerlukan langganan.'
            }
          ]
        },
        {
          category: 'Akun & Pengaturan',
          items: [
            {
              question: 'Bagaimana cara membuat akun?',
              answer: 'Klik tombol "Daftar" di pojok kanan atas, isi formulir pendaftaran dengan data diri Anda, dan ikuti petunjuk verifikasi email yang akan dikirimkan.'
            },
            {
              question: 'Bagaimana cara mengubah pengaturan notifikasi?',
              answer: 'Masuk ke akun Anda, klik menu "Pengaturan", pilih tab "Notifikasi", dan sesuaikan preferensi notifikasi sesuai keinginan Anda.'
            }
          ]
        },
        {
          category: 'Konten & Kategori',
          items: [
            {
              question: 'Berapa kali berita diperbarui?',
              answer: 'Kami memperbarui berita secara real-time setiap hari. Berita terbaru akan muncul di halaman utama segera setelah dipublikasikan.'
            },
            {
              question: 'Bagaimana cara mencari berita berdasarkan kategori?',
              answer: 'Gunakan menu kategori di sidebar atau header website untuk menjelajahi berita berdasarkan kategori yang Anda minati.'
            },
            {
              question: 'Apakah saya bisa menyimpan berita untuk dibaca nanti?',
              answer: 'Ya, Anda dapat menyimpan berita dengan mengklik ikon bookmark di setiap artikel. Berita yang disimpan dapat diakses melalui menu "Bookmark" di akun Anda.'
            }
          ]
        },
        {
          category: 'Teknis',
          items: [
            {
              question: 'Apakah ada aplikasi mobile?',
              answer: 'Ya, Anda dapat mengunduh aplikasi mobile kami di Google Play Store untuk Android atau App Store untuk iOS.'
            },
            {
              question: 'Bagaimana jika saya mengalami masalah teknis?',
              answer: 'Silakan hubungi tim support kami melalui menu "Bantuan" atau kirim email ke support@paradaya.com untuk mendapatkan bantuan teknis.'
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