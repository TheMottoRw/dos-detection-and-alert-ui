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
          

          <h3 class="text-4xl font-bold mb-4">Content classification </h3>
          <p class="text-green-100 mb-8 leading-relaxed"><br>
            To stay connected with us<br>
            please sign up to test this web content classification
          </p><br>
          <RouterLink to="/">

          <button class="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-colors">
            SIGN IN
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
            <h2 class="text-3xl font-bold text-blue-800 mb-2">Web content classification</h2>
            <p class="text-gray-600">Signup to start testing and interact with this project</p>
          </div>

          <form class="space-y-4">
            <div>
              <input
                  v-model="name"
                  type="text"
                  placeholder="Name"
                  class="w-full px-4 py-4 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
            </div>
            <div>
              <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-4 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
            </div>

            <div class="relative">
              <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  class="w-full px-4 py-4 pr-12 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
              </button>
            </div>

            <button
                type="submit"
                class="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
</script>

<style>
svg {
  transform: scale(1.2);
}
</style>