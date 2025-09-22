<template>
  <div class="min-h-screen flex items-start mt-20 justify-center mr-20 p-4">
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
      <!-- Left Green Section -->
      <div class="relative dark:bg-primary text-white p-8 flex-1 flex flex-col justify-center">
        <!-- Curved white overlay -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full"></div>

        <!-- Logo and branding -->
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-8">
            <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mr-4">
              <font-awesome-icon :icon="['fas','lock']" size="4x" class="text-white" />
            </div>
<!--            <span class="text-xl font-medium">20% Project</span>-->
          </div>
          

          <h3 class="text-4xl font-bold mb-4">Change password </h3>
          <p class="text-green-100 mb-8 leading-relaxed"><br>
            Use strong password with lowercase,uppercase,numeric,and special characters
          </p><br>

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
            <h2 class="text-3xl font-bold text-primary mb-2">Web content classification</h2>
            <p class="text-gray-600">Changing password ensure your account safety</p>
          </div>

          <form class="space-y-4">
            <div class="relative">
              <input
                  v-model="currentPassword"
                  :type="showCurrent ? 'text' : 'password'"
                  placeholder="Current password"
                  class="w-full px-4 py-4 pr-12 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
              <button type="button" @click="showCurrent = !showCurrent" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', showCurrent ? 'eye-slash' : 'eye']" />
              </button>
            </div>
            <div class="relative">
              <input
                  v-model="newPassword"
                  :type="showNew ? 'text' : 'password'"
                  placeholder="New password"
                  class="w-full px-4 py-4 pr-12 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
              <button type="button" @click="showNew = !showNew" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', showNew ? 'eye-slash' : 'eye']" />
              </button>
            </div>

            <div class="relative">
              <input
                  v-model="confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="Confirm Password"
                  class="w-full px-4 py-4 pr-12 bg-blue-200 focus:bg-white border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
              <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', showConfirm ? 'eye-slash' : 'eye']" />
              </button>
            </div>

            <button
                type="submit"
                class="w-full bg-primary text-white py-4 rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              CHANGE PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
</script>

<style>
svg {
  transform: scale(1.2);
}
</style>