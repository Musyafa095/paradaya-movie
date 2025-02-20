import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    component: () => import("@/views/HomePage.vue"),
    name: "Home",
    meta: {
      layout: 'Default',
      requiresAuth: true
    },
  },
  {
    path: "/dashboard",
    component: () => import("@/layouts/Dashboard.vue"),
    name: "Dashboard",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      {
        path: "", 
        name: "HomeDashboard",
        component: () => import("@/components/Admin/HomeDashboard.vue"),
      },
      {
        path: "news",
        name: "News",
        component: () => import("@/components/Admin/News.vue"),
      },    
      {
        path: "category",
        name: "Category",
        component: () => import("@/components/Admin/Category.vue"),
      },
      {
        path: "faq",
        name: "Faq",
        component: () => import("@/components/Admin/Faq.vue"),
      }
    ]
  },  
  {
    path: "/profile/:id",
    component: () => import("@/views/Profile.vue"),
    meta: {
      layout: "Default",
      requiresAuth: true
    },
  },
  {
    path: "/news/:id",
    component: () => import("@/views/NewsDetail.vue"),
    name: "NewsDetail",
    meta: {
      layout: "Default",
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
    meta: {
      guestOnly: true 
    },
  },
  {
    path: "/register",
    component: () => import("@/views/Register.vue"),
    meta: {
      guestOnly: true
    },
  },
  {
    path: "/verify-account",
    name: "VerifyAccount",
    component: () => import("@/views/VerifyAccount.vue"),
    meta: {
      requiresAuth: true, // Hanya bisa diakses jika sudah login
      requiresUnverified: true // Hanya bisa diakses jika belum verifikasi
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async(to, from, next) => {
  const store = authStore();

  if (!store.currentUser && store.token) {
    await store.getUserLogged();
  }

  if (to.meta.requiresAuth) {
    if (!store.token) {
      store.showNotification("Anda harus login terlebih dahulu");
      return next("/login");
    }
  }

  // **Pastikan hanya user yang perlu verifikasi email**
  if (store.token && store.currentUser) {
    if (
      store.currentUser.role.name === "user" &&  
      !store.currentUser.email_verified_at && 
      to.path !== "/verify-account"
    ) {
      store.showNotification("Silakan verifikasi email Anda terlebih dahulu");
      return next("/verify-account");
    }
  }
  

  // Jika user sudah verifikasi tetapi mencoba mengakses halaman verifikasi
  if (store.token && store.currentUser?.email_verified_at && to.path === "/verify-account") {
    store.showNotification("Anda berhasil login dan  sudah terverifikasi");
    return next("/");
  }

  // **Khusus untuk halaman admin**
  if (to.meta.requiresAdmin) {
    if (!store.token) {
      store.showNotification("Anda harus login terlebih dahulu");
      return next("/login");
    }
    if (store.currentUser?.role?.name !== "admin") {
      store.showNotification("Anda bukan admin");
      return next("/");
    }
  }

  next();
});
  
export default router;