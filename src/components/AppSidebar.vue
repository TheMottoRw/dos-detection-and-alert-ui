<template>
  <aside class="w-80 h-screen sticky top-0 bg-primary border-sidebar-border flex flex-col pb-20">
    <!-- Logo -->
    <div class="p-8 border-sidebar-border">
      <div class="flex items-center gap-4">
        <div class="w-24 h-16 bg-white rounded-lg flex items-center justify-center">
          <span class="text-primary font-bold text-3xl">DOS</span>
        </div>
<!--        <div class="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mr-4">-->
<!--          <font-awesome-icon :icon="['fas','globe']" size="3x" class="text-white" />-->
<!--        </div>-->
        <span class="font-bold text-lg text-sidebar-foreground text-white">MONITORING & DETECTION</span>
      </div><br>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 text-white overflow-y-auto">
      <ul class="space-y-3">

        <li>
          <RouterLink to="/dashboard"  v-slot="{ href, navigate, isActive }">
            <a
                :href="href"
                @click="navigate"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                :class="isActive? 'bg-blue-800 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
            Dashboard
            </a>
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/keywords" v-slot="{ href, navigate, isActive }">
            <a
                :href="href"
                @click="navigate"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                :class="isActive? 'bg-blue-800 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Keywords
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/logs" v-slot="{ href, navigate, isActive }">
            <a
                :href="href"
                @click="navigate"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                :class="isActive? 'bg-blue-800 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Logs
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/profile" v-slot="{ href, navigate, isActive }">
            <a
                :href="href"
                @click="navigate"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                :class="isActive? 'bg-blue-800 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'"
            >

              <font-awesome-icon :icon="['fas','user']" size="lg" class="text-white" />
              Profile
            </a>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/change/password" v-slot="{ href, navigate, isActive }">
            <a
                :href="href"
                @click="navigate"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                :class="isActive? 'bg-blue-800 text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Change Password
            </a>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Bottom Menu -->
    <div class="p-4 border-t text-white">
      <ul class="space-y-1">
        <li>
          <RouterLink to="/login"
              :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                ]"
                      @click="logout"
          >
            <font-awesome-icon :icon="['fas','right-from-bracket']" size="lg" class="text-white" />
            Logout <br>({{ email }})
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>

</template>

<script setup>
// Simple sidebar navigation. Uses RouterLink for navigation.
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'
import {onMounted, ref} from "vue";


const router = useRouter()
const email = ref('')
async function logout(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault()
  try {
    localStorage.removeItem('token')
  } catch (_) {}
  try {
    const { useUserStore } = await import('../store/userStore.js')
    useUserStore().clear()
  } catch (_) {}
  router.push('/')
}
onMounted(()=>{
  email.value = useUserStore().state.email
})

</script>
