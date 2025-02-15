import { createRouter, createWebHistory } from "vue-router";  
import HomePage from "@/views/HomePage.vue";
import { authStore } from "@/stores/auth";

const routes = [
 {
  path: "/",
  component: HomePage,
  meta: {
    layout: 'Default'
  },
 },

];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
const store = authStore();
if (to.meta.isAuth && store.token) {
  alert("Anda sudah login");
  return next("/");
}

if (to.meta.isAdmin && store.currentUser.role.name !== "admin") {
  
  alert("Anda bukan admin");
  return next("/");
}

next();
});

export default router;
