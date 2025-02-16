import { ref } from "vue";
import { defineStore } from "pinia";

import { apiClient } from "@/config/api";
import { useRouter } from "vue-router";

export const authStore = defineStore("auth", () => {
  const router = useRouter();
  const token = ref(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );
  const currentUser = ref(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const profile = ref(
    localStorage.getItem("profile")
      ? JSON.parse(localStorage.getItem("profile"))
      : null
  );
  
  const showAlert = ref(false);
  const alertMessage = ref("");

  function showNotification(message, duration = 5000) {
    alertMessage.value = message;
    showAlert.value = true;
    
    setTimeout(() => {
      showAlert.value = false;
    }, duration);
  }

  async function register({ name, email, password, password_confirmation }) {
    try {
      const { data } = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });
      showNotification("User berhasil register, silahkan login & cek email anda");
      router.replace("/login");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          let errorMessage = '';
          
          Object.values(errors).forEach(messages => {
            errorMessage += messages.join(', ') + '\n';
          });
          
          showNotification(errorMessage.trim());
        } else {
          showNotification(error.response.data.message || "Terjadi kesalahan");
        }
      } else if (error.request) {
        showNotification("Tidak dapat terhubung ke server");
      } else {
        showNotification("Terjadi kesalahan");
      }
      console.error('Error detail:', error);
    }
  }

  async function login({ email, password }) {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      token.value = data.token;
      currentUser.value = data.user;
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(currentUser.value));
      showNotification("Berhasil Login");
      console.log("Status verifikasi:", data.user.email_verified_at);
  
      if (data.user.role.name === "admin") {
        router.replace("/");
      } else if (data.user.role.name === "user") {
        if (data.user.email_verified_at) {
          router.replace("/");
        } else {
          router.replace("/verify-account");
        }
      } else {
        showNotification("Role tidak valid");
      }
    } catch (error) {
      if (error.response) {
        // Error dari server dengan status code
        if (error.response.status === 422) {
          // Validation error (misalnya, email atau password salah)
          const errors = error.response.data.errors;
          let errorMessage = '';
  
          // Gabungkan semua pesan error
          Object.values(errors).forEach(messages => {
            errorMessage += messages.join(', ') + '\n';
          });
  
          showNotification(errorMessage.trim()); // Tampilkan notifikasi error
        } else if (error.response.status === 401) {
          // Unauthorized (misalnya, email atau password salah)
          showNotification(error.response.data.message || "Email atau password salah");
        } else {
          // Error lain dari server
          showNotification(error.response.data.message || "Terjadi kesalahan");
        }
      } else if (error.request) {
        // Error karena tidak ada response dari server
        showNotification("Tidak dapat terhubung ke server");
      } else {
        // Error lainnya
        showNotification("Terjadi kesalahan");
      }
      console.error('Error detail:', error);
    }
  }
  async function logout() {
    try {
      const { data } = await apiClient.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
  
      token.value = null;
      currentUser.value = null;
      profile.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
  
      showNotification(data.message || "Anda berhasil logout");
      router.replace("/login");
    } catch (error) {
      showNotification("Gagal logout, coba lagi nanti");
      console.error("Error detail:", error);
    }
  }
  async function getUserLogged() {
    try {
      const { data } = await apiClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
  
      currentUser.value = data.user;
      localStorage.setItem("user", JSON.stringify(currentUser.value)); // Simpan data terbaru
      return data.user;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  }

  async function verifyAccount(otp) {
    try {
      const { data } = await apiClient.post(
        "/auth/account_verification",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
  
      // Perbarui data user setelah verifikasi
      await getUserLogged();
      showNotification("Akun berhasil diverifikasi!");
      router.replace("/");
    } catch (error) {
      if (error.response?.status === 422) {
        showNotification("Kode OTP salah atau sudah kadaluarsa");
      } else {
        showNotification("Gagal verifikasi akun");
      }
      console.error("Error detail:", error);
    }
  }
  async function generateOtp(email) {
    try {
      const { data } = await apiClient.post(
        "/auth/generate_otp_code",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      const successMessage = data.message;
      showNotification(successMessage); 
    } catch (error) {
      console.log(error.message);
    }
  }

  async function uploadProfile(payload) {
    try {
      const { data } = await apiClient.post("/profile", payload, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      profile.value = data.user;
      localStorage.setItem("profile", JSON.stringify(profile.value));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    token,
    register,
    currentUser,
    login,
    logout,
    getUserLogged,
    verifyAccount,
    generateOtp,
    uploadProfile,
    showAlert,
    alertMessage
  };
});