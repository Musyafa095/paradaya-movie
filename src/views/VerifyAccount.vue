<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md rounded-lg bg-white shadow-lg sm:w-96">
      <div class="p-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 sm:text-3xl">
            Verifikasi Akun Anda
          </h2>
          <p class="mt-2 text-sm text-gray-600 sm:text-base">
            Kami telah mengirimkan email ke
            <span class="font-medium text-blue-600"></span>. Silakan periksa
            kotak masuk Anda untuk kode verifikasi.
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
            class="w-full rounded-lg bg-gradient-to-r from-red-500 via-purple-800 to-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Verifikasi
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Tidak menerima email?
            <button
              @click="resendCode"
              class="font-medium text-blue-600 hover:underline"
            >
              Kirim Ulang
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "@/stores/auth";
import { ref } from "vue";

const auth = authStore();
const otp_code = ref(null);

const onVerifyAccount = () => {
  auth.verifyAccount(otp_code.value);
  otp_code.value = "";
};

const resendCode = () => {
  auth.generateOtp(auth.currentUser.email);
};
</script>