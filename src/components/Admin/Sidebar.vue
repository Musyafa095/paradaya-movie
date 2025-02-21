<template>
  <div>
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-20 btn btn-circle btn-ghost"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          v-if="!isOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Sidebar Backdrop -->
    <div
      v-if="isOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'bg-base-100 fixed lg:relative z-20 min-h-screen transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Toggle Collapse Button (Desktop only) -->
      <button 
        @click="toggleCollapse"
        class="hidden lg:block absolute -right-3 top-10 btn btn-circle btn-sm btn-ghost"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          :class="{ 'rotate-180': isCollapsed }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- Logo/Brand -->
      <div class="p-4 mb-6">
        <h2 :class="[
          'font-bold transition-all duration-300',
          isCollapsed ? 'text-lg text-center' : 'text-2xl'
        ]">
          {{ isCollapsed ? 'PD' : 'Dashboard ParadayaNews.com' }}
        </h2>
      </div>

      <!-- Main Menu -->
      <ul class="menu menu-sm bg-base-100 rounded-box mx-2">
        <li>
          <router-link to="/dashboard" class="active:bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
            <span :class="{ 'hidden': isCollapsed }">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/news">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
              />
            </svg>    
            <span :class="{ 'hidden': isCollapsed }">News</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/category">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span :class="{ 'hidden': isCollapsed }">Category</span>
          </router-link>
        </li>
      </ul>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Bottom Menu -->
      <ul class="menu menu-sm bg-base-100 rounded-box mx-2">
        <li>
          <router-link to="/dashboard/faq">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span :class="{ 'hidden': isCollapsed }">FAQ</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isOpen: false,
      isCollapsed: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  },
  watch: {
    '$route'() {
      // Close sidebar on route change (mobile only)
      if (window.innerWidth < 1024) {
        this.isOpen = false;
      }
    }
  }
};
</script>