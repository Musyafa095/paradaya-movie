<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <!-- Alert dari auth store -->
    <div v-if="auth.showAlert" class="alert shadow-lg fixed top-4 right-4 w-96 z-50">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ auth.alertMessage }}</span>
      </div>
    </div>

    <div class="w-full max-w-md rounded-lg bg-white shadow-lg sm:w-96">
      <div class="p-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 sm:text-3xl">
            Verifikasi Akun Anda
          </h2>
          <p class="mt-2 text-sm text-gray-600 sm:text-base">
            Kami telah mengirimkan email ke
            <span class="font-medium text-blue-600">{{ auth.currentUser?.email }}</span>.
            Silakan periksa kotak masuk Anda untuk kode verifikasi.
          </p>
        </div>

        <form @submit.prevent="onVerifyAccount" class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Masukkan Kode OTP
            </label>
            <input
              type="text"
              class="mt-1 w-full rounded-lg border-gray-300 p-3 text-black sm:text-sm bg-white"
              placeholder="Contoh: 123456"  
              v-model="otp_code"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-lg bg-gradient-to-r from-red-500 via-purple-800 to-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 hover:scale-105 active:scale-95 font-bold disabled:opacity-50"
          >
            {{ isSubmitting ? 'Memverifikasi...' : 'Verifikasi' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Tidak menerima email?
            <button
              @click="resendCode"
              :disabled="isResending"
              class="font-medium text-blue-600 hover:underline disabled:opacity-50"
            >
              {{ isResending ? 'Mengirim...' : 'Kirim Ulang' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authStore } from "@/stores/auth";
import router from "@/routes";

const auth = authStore();
const otp_code = ref(null);
const isSubmitting = ref(false);
const isResending = ref(false);

const onVerifyAccount = async () => {
  if (!otp_code.value) {
    auth.showNotification('Silakan masukkan kode OTP');
    return;
  }

  try {
    isSubmitting.value = true;
    await auth.verifyAccount(otp_code.value);
    auth.showNotification('Akun berhasil diverifikasi!');
    otp_code.value = "";
    router.replace("/");  
  } catch (error) {
    if (error.response?.status === 422) {
      auth.showNotification('Kode OTP salah atau sudah kadaluarsa');
    } else {
      auth.showNotification('Gagal verifikasi akun');
    } 
    console.error("Error detail:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resendCode = async () => {
  try {
    isResending.value = true;
    await auth.generateOtp(auth.currentUser.email);
    auth.showNotification('Kode OTP berhasil dikirim ulang');
  } catch (error) {
    auth.showNotification('Gagal mengirim ulang kode OTP');
    console.error(error.message);
  } finally {
    isResending.value = false;
  }
};
</script>