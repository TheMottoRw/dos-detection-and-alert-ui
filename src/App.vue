<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import MainContent from './components/MainContent.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
// Hide entire app chrome (sidebar/footer/wrappers) on select routes
const hideChrome = computed(() => ['/', '/signup', '/defacement'].includes(route.path))
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <template v-if="hideChrome">
      <!-- Render routed view directly without sidebar/footer/wrappers -->
      <router-view />
    </template>
    <template v-else>
      <div class="flex flex-1 min-h-0">
        <AppSidebar />
        <MainContent />
      </div>
      <AppFooter />
    </template>
  </div>
</template>

<style scoped>
/* Keep minimal resets; Tailwind handles the rest */
* { box-sizing: border-box; }
html, body, #app { height: 100%; }
body { margin: 0; }

.nav a.is-active,
.nav a.is-exact-active {
  background: #16a34a;
  color: white;
  border-radius: 8px;
}


</style>
