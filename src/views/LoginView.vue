<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
      <!-- Left Green Section -->
      <div class="relative bg-primary text-white p-8 flex-1 flex flex-col justify-center">
        <!-- Curved white overlay -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full"></div>

        <!-- Logo and branding -->
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-8">
            <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mr-4">
              <font-awesome-icon :icon="['fas','globe']" size="4x" class="text-white" />
            </div>
<!--            <span class="text-xl font-medium">20% Project</span>-->
          </div>
          

          <h3 class="text-4xl font-bold mb-4">DOS Monitoring </h3>
          <p class="text-green-100 mb-8 leading-relaxed">
                       monitoring denial of service for the availability
          </p>

          <RouterLink to="/signup">

            <button class="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-colors">
              SIGN UP
            </button>
          </RouterLink>

<!--          <div class="mt-8 text-sm text-green-100">-->
<!--            <span class="cursor-pointer hover:text-white">CREATOR HERE</span>-->
<!--            <span class="mx-2">|</span>-->
<!--            <span class="cursor-pointer hover:text-white">DIRECTOR HERE</span>-->
<!--          </div>-->
        </div>
      </div>

      <!-- Right Form Section -->
      <div class="flex-1 p-8 flex flex-col justify-center">
        <div class="max-w-sm mx-auto w-full">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-primary mb-2">DOS/DDOS Monitoring</h2>
            <p class="text-gray-600">Login in to your account to continue</p>
            <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>

          </div>

          <form class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-4 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

            <div class="relative">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Password"
                  class="w-full px-4 py-4 pr-12 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              >
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </div>

            <div class="text-center">
              <a href="/table" class="text-sm text-gray-600 hover:text-gray-800">Forgot your password?</a>
            </div>

            <button
                type="submit"
                class="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-60"
                :disabled="submitting"
            >
              <span v-if="submitting">Logging in...</span>
              <span v-else>SIGN IN</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/http.js'

const email = ref('asua@yopmail.com')
const password = ref('12345')
const showPassword = ref(false)
const errorMessage = ref('')
const submitting = ref(false)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const router = useRouter()

async function handleLogin() {
  errorMessage.value = ''

  // basic validation
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password.'
    return
  }

  submitting.value = true
  try {
    const { data } = await api.post(`/auth/login`,  {
      email: email.value,
      password: password.value
    })
    // Expect token in response (data.token), fallback to entire data
    const token = data?.token || data?.accessToken || data?.jwt || ''
    if (!token) {
      throw new Error(data?.message || 'Invalid login response')
    }
    try {
      localStorage.setItem('token', token)
    } catch (_) {}
    // update global user store
    try {
      const { useUserStore } = await import('../store/userStore.js')
      useUserStore().setToken(token)
    } catch (_) {}
    // Navigate to keywords on success
    router.push('/keywords')
  } catch (err) {
    const msg = err?.response?.data?.error || err?.message || 'Login failed'
    errorMessage.value = msg
  } finally {
    submitting.value = false
  }
}
</script>

<style>
svg {
  transform: scale(1.2);
}
</style>