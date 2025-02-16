import { createRouter, createWebHistory } from "vue-router";
import Profile from "@/views/Profile.vue";
import DetailNews from "@/views/DetailNews.vue";
import Dashboard from "@/views/Admin/Dashboard.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import { authStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    component: () => import("@/views/HomePage.vue"),
    name: "Home",
    meta: {
      layout: 'Default',
      requiresVerification: true,
    },
  },
  {
    path: "/profile/:id",
    component: Profile,
    meta: {
      layout: "Default",
      isAuth: true, 
    },
  },
  {
    path: "/news/:id",
    component: DetailNews,
    meta: {
      layout: "Default",
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      layout: "Dashboard",
      isAuth: true, 
      isAdmin: true, 
    },
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/verify-account",
    name: "VerifyAccount",
    component: () => import("@/views/VerifyAccount.vue"),
    meta: {
      isAuth: true, // Hanya bisa diakses oleh pengguna yang sudah login
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = authStore();

  // Jika route memerlukan autentikasi dan pengguna belum login
  if (to.meta.isAuth && !store.token) {
    showNotification("Anda harus login terlebih dahulu");
    return next("/login");
  }

  // Jika pengguna sudah login tetapi mencoba mengakses halaman login/register
  if ((to.path === "/login" || to.path === "/register") && store.token) {
    showNotification("Anda sudah login");
    return next("/");
  }

  // Jika route memerlukan akses admin dan pengguna bukan admin
  if (to.meta.isAdmin && store.currentUser?.role?.name !== "admin") {
    showNotification("Anda bukan admin");
    return next("/");
  }

  // Lanjutkan navigasi
  next();
});
export default router;