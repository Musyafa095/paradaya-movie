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

  async function register({ name, email, password, password_confirmation }) {
    try {
      const { data } = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      const succesMessage = data.message;
      alert(succesMessage);

      router.replace("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function login({ email, password }) {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      token.value = data.token;
      currentUser.value = data.user;
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(currentUser.value));
      alert("Berhasil Login");
      router.replace("/verify-account");
    } catch (error) {
      alert("Email atau Password anda salah");
      console.log(error.message);
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

      alert(data.message);
      router.replace("/login");
    } catch (error) {
      console.log(error.message);
    }
  }
  async function getUserLogged() {
    try {
      const { data } = await apiClient.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      currentUser.value = data.user;
      localStorage.setItem("user", JSON.stringify(currentUser));
      return data.user;
    } catch (error) {
      console.log(error.message);
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
      getUserLogged();
      const succesMessage = data.message;
      alert(succesMessage);
      router.replace("/");
    } catch (error) {
      console.log(error.message);
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
      alert(successMessage);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function uploadProfile(payload) {
    try {
      const { data } = await apiClient.post("/auth/profile", payload, {
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
  };
});