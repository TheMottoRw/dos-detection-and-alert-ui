<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import MainContent from './components/MainContent.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
// Hide sidebar and footer on auth pages
const hideChrome = computed(() => ['/', '/signup'].includes(route.path))
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <div class="flex flex-1 min-h-0">
      <AppSidebar v-if="!hideChrome" />
      <MainContent />
    </div>
    <AppFooter v-if="!hideChrome" />
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
