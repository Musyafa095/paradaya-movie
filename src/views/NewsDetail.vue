<template>
  <Default>
    <div class="min-h-screen light:bg-gray-900 transition-colors duration-200">
      <!-- Loading State -->
      <div v-if="isLoading" class="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 light:border-gray-900"></div>
        <p class="ml-4 text-gray-600 dark:text-gray-300">Memuat berita...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="container mx-auto px-4 py-8 text-center">
        <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          <button 
            @click="fetchNewsDetail" 
            class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="newsDetail" class="w-full">
        <div class="container mx-auto px-4 max-w-4xl">
          <!-- Navigation -->
          <nav class="py-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <RouterLink 
              to="/" 
              class="inline-flex items-center light:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Kembali ke Beranda
            </RouterLink>
          </nav>

          <!-- Article Header -->
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold light:text-gray-900 font-sans mb-4 leading-tight">
              {{ newsDetail.title }}
            </h1>
            <div class="flex items-center text-md light:text-gray-600">
              <time :datetime="newsDetail.date" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(newsDetail.date) }}
              </time>
            </div>
          </header>

          <!-- Article Content -->
          <article>
            <figure class="mb-8 -mx-4 lg:mx-0 rounded-lg overflow-hidden">
              <img :src="newsDetail.image" :alt="newsDetail.title" class="w-full h-auto max-h-[600px] object-cover" />
            </figure>
            <div class="prose prose-lg max-w-none light:prose-invert mb-8 indent-4">
              <div v-html="newsDetail.content" class="news-content light:text-gray-800 font-montserrat"></div>
            </div>
          </article>

          <!-- Sosial Media -->
         <div class="border-t border-gray-200 light:border-gray-700 pt-6 mb-8"> 
            <h3 class="text-lg font-semibold mb-4 light:text-gray-700">  
                 Bagikan berita  
                 </h3>   
                 <div class="flex items-center gap-3">     
                  <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"    
                     aria-label="Bagikan ke Facebook" >     
                       <svg class="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">        
                         <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>      
                         </svg>     
                  </button>          
              <button  class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"      
               aria-label="Bagikan ke Twitter">
              <svg class="w-6 h-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">         
                <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z"/>      
               </svg> 
                  </button>         
                   <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"       aria-label="Bagikan ke WhatsApp"> 
                <svg class="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">         
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>     
                  </svg>   
                  </button>    
                    <!-- Instagram Icon -->    
                      <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"       aria-label="Bagikan ke Instagram" >       
                        <svg class="w-6 h-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">        
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>       
                          </svg>     
                        </button>   
                      </div> 
        </div>
          <!-- Comments Section -->
          <section class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span>Komentar</span>
              <span class="light:text-gray-700 text-lg">({{ comments.length }})</span>
            </h2>

            <!-- Form Komentar (Hanya Jika User Login) -->
            <div v-if="user" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
              <textarea
                v-model="newComment"
                placeholder="Tulis komentar Anda..."
                class="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="3"
              ></textarea>
              <div class="mt-4 flex items-center justify-between">
                <p class="text-sm text-info font-mono">* Admin membatasi jumlah komentar, Pengguna hanya bisa mengirim 1 komentar 📌</p>
                <button
                  @click="handleSubmitComment"
                  :disabled="!newComment.trim() || isSubmitting"
                  class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <span v-if="isSubmitting">Mengirim...</span>
                  <span v-else>Kirim Komentar</span>
                </button>
              </div>
            </div>

            <!-- Jika Belum Login, Tampilkan Pesan -->
            <div v-else class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 text-center">
              <p class="text-gray-600 dark:text-gray-400">
                Silakan 
                <RouterLink to="/login" class="text-blue-600 hover:underline">login</RouterLink>
                untuk mengirim komentar
              </p>
            </div>

            <!-- Daftar Komentar -->
            <div v-if="comments.length > 0" class="space-y-6">
  <div
    v-for="comment in sortedComments"
    :key="comment.id"
    class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
  >
    <div class="flex items-start gap-4">
      <img 
  :src="comment.user.profile_image" 
  alt="User profile" 
  class="w-12 h-12 rounded-full object-cover"
/>
      <div class="flex-1">
        <h4 class="font-medium text-gray-900 dark:text-white">
          {{ comment.user.name || 'Pengguna' }}
        </h4>
        <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mt-2">
          {{ comment.comment }}
        </p>
      </div>
    </div>
  </div>
</div>
            <!-- Jika Tidak Ada Komentar -->
            <div v-else class="text-center py-8">
              <p class="light:text-gray-700 mb-2 font-roboto">
                Belum ada komentar untuk berita ini 💬
              </p>
              <p class="text-sm light:text-gray-500">
                Jadilah yang pertama berbagi pendapat Anda!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Default>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useNewsStore } from '@/stores/news'
import { authStore } from '@/stores/auth'
import Default from '@/layouts/Default.vue'

// Inisialisasi
const route = useRoute()
const newsStore = useNewsStore()
const auth = authStore()
const user = computed(() => auth.currentUser)

const newsDetail = ref(null)
const isLoading = ref(true)
const error = ref(null)
const newComment = ref('')
const comments = ref([])
const isSubmitting = ref(false)

// Computed untuk sorting komentar (jika diperlukan)
const sortedComments = computed(() => {
  return [...comments.value|| []].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Helper format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  let d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  d.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta'
  }).format(d);
};



// Ambil detail berita dan komentar
const fetchNewsDetail = async () => {
  try {
    isLoading.value = true
    error.value = null
    const newsData = await newsStore.getNewsById(route.params.id)
    newsDetail.value = newsData
    if (newsData.comments) {
      comments.value = newsData.comments.map(comment => ({
        ...comment,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          profile_image: comment.user.profile?.image || 'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png' // Default jika tidak ada gambar
        },
        isEditing: false,
        editText: ''
      }));
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat berita';
  } finally {
    isLoading.value = false;
  }
};

// Fungsi kirim komentar
const handleSubmitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return

  try {
    isSubmitting.value = true
     await auth.uploadComment(route.params.id, newComment.value.trim())
    // Setelah sukses, ambil ulang data berita agar komentar terbaru muncul
    await fetchNewsDetail()
      newComment.value = ''
  } catch (err) {
    console.error('Error posting comment:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Panggil fetchNewsDetail saat komponen dimuat
onMounted(() => {
  fetchNewsDetail()
})
</script>
<style scoped>
.news-content p {
  margin-bottom: 1rem;
}

.news-content br {
  display: block;
  margin-top: 1rem;
}
.news-content {
  white-space: pre-wrap;
  font-size: 1.125rem;
}

</style>