<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 max-w-6xl ml-12 mr-2">
    <!-- <CHANGE> Restructured to 2-column grid layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column - User Information -->
      <div class="space-y-6">

        <!-- Profile Card -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <div class="flex flex-col items-center text-center space-y-4">
            <!-- Profile Image -->
              <div class="flex items-center justify-center mb-8">
                <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center mr-4">
                  <font-awesome-icon :icon="['fas','globe']" size="7x" class="text-primary" />
                </div>
                <!--            <span class="text-xl font-medium">20% Project</span>-->
              </div>

            <!-- User Details -->
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-800">{{ userInfo.name }}</h3>
              <p class="text-gray-600">{{ userInfo.email }}</p>
            </div>

          </div>
        </div>
      </div>

      <!-- Right Column - Forms -->
      <div class="space-y-6">

        <!-- Edit Profile Form -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 relative">
          <div class="absolute w-10 h-10 bg-primary rounded-full flex items-center justify-center right-4 cursor-pointer" @click="profileForm.editable = !profileForm.editable" v-if="!profileForm.editable">
            <font-awesome-icon :icon="['fas','pencil']" size="1x" class="text-white" />
          </div>
          <div class="absolute w-8 h-8 rounded-full flex items-center justify-center right-4 cursor-pointer" @click="profileForm.editable = !profileForm.editable" v-if="profileForm.editable">
            <font-awesome-icon :icon="['fas','circle-check']" size="2x" class="text-green-700" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h3>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                  v-model="profileForm.name"
                  type="text"
                  :class="{'w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all':true,
                          'cursor-not-allowed':!profileForm.editable}"                  placeholder="Enter your full name"
                  :disabled="!profileForm.editable"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                  v-model="profileForm.email"
                  type="email"
                  :class="{'w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all':true,
                          'cursor-not-allowed':!profileForm.editable}"
                  placeholder="Enter your email"
                  :disabled="!profileForm.editable"

              />
            </div>

            <button
                type="submit"
                :class="{'w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-60':true,
                          'cursor-not-allowed':!profileForm.editable}"
                :disabled="!profileForm.editable || submittingProfile"
            >
              <span v-if="submittingProfile">Updating...</span>
              <span v-else>Update Profile</span>
            </button>

            <div v-if="profileSuccess" class="text-green-600 text-sm text-center">
              ✓ Profile updated successfully!
            </div>
            <div v-if="profileError" class="text-red-600 text-sm text-center">
              {{ profileError }}
            </div>
          </form>
        </div>

        <!-- Change Password Form -->
        <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 relative">
          <div class="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center right-4 cursor-pointer" @click="passwordForm.editable = !passwordForm.editable" v-if="passwordForm.editable">
            <font-awesome-icon :icon="['fas','unlock']" size="1x" class="text-white" />
          </div>
          <div class="absolute w-8 h-8 bg-green-700 rounded-full flex items-center justify-center right-4 cursor-pointer" @click="passwordForm.editable = !passwordForm.editable" v-if="!passwordForm.editable">
            <font-awesome-icon :icon="['fas','lock']" size="1x" class="text-white" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Change Password</h3>
          <p v-if="passwordMessage" class="text-green-700 text-sm mb-2">{{ passwordMessage }}</p>
          <p v-if="passwordError" class="text-red-600 text-sm mb-2">{{ passwordError }}</p>

          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div class="relative">
                <input
                    v-model="passwordForm.currentPassword"
                    :type="showCurrent ? 'text' : 'password'"
                    :class="{'w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all':true,
                            'cursor-not-allowed':!passwordForm.editable}"
                    :disabled="!passwordForm.editable"
                    placeholder="Enter current password"
                />
                <button type="button" @click="showCurrent = !showCurrent" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                  <font-awesome-icon :icon="['fas', showCurrent ? 'eye-slash' : 'eye']" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div class="relative">
                <input
                    v-model="passwordForm.newPassword"
                    :type="showNew ? 'text' : 'password'"
                    :class="{'w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all':true,
                            'cursor-not-allowed':!passwordForm.editable}"
                    :disabled="!passwordForm.editable"
                    placeholder="Enter new password"
                />
                <button type="button" @click="showNew = !showNew" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                  <font-awesome-icon :icon="['fas', showNew ? 'eye-slash' : 'eye']" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div class="relative">
                <input
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    :class="{'w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all':true,
                            'cursor-not-allowed':!passwordForm.editable}"
                    :disabled="!passwordForm.editable"
                    placeholder="Confirm new password"
                />
                <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
                  <font-awesome-icon :icon="['fas', showConfirm ? 'eye-slash' : 'eye']" />
                </button>
              </div>
            </div>

            <button
                type="submit"
                :class="{'w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg':true,
                          'cursor-not-allowed':!passwordForm.editable}"
                :disabled="!passwordForm.editable"
            @click="changePassword">
              Change Password
            </button>

            <div v-if="passwordSuccess" class="text-green-600 text-sm text-center">
              ✓ Password changed successfully!
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted,watch } from 'vue'


// User information from global userStore
import { useUserStore } from '../store/userStore'
const userStore = useUserStore()
// password visibility toggles
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const userInfo = reactive({
  name: userStore.state.name,
  email: userStore.state.email,
})

watch(() => userStore.state, (s) => {
  userInfo.name = s.name
  userInfo.email = s.email
})

// Profile form
const profileForm = reactive({
  name: userInfo.name,
  email: userInfo.email,
  editable:false,
})

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  editable:false
})

// Success states
const profileSuccess = ref(false)
const passwordSuccess = ref(false)
// Password feedback
const passwordMessage = ref('')
const passwordError = ref('')

// Form handlers
import api from '../services/http.js'

const submittingProfile = ref(false)
const profileError = ref('')
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function updateProfile() {
  if (!profileForm.editable) return
  profileError.value = ''
  profileSuccess.value = false
  submittingProfile.value = true
  try {
    const userId = userStore.state._id || 'me'
    const { data, status } = await api.post(`/user/${encodeURIComponent(userId)}/profile`, {
      name: profileForm.name,
      email: profileForm.email,
    })

    // Consider 200 as success and expect a new token in the response
    if (status === 200) {
      const newToken = data?.token || data?.accessToken || data?.jwt || ''
      if (newToken) {
        try { localStorage.setItem('token', newToken) } catch (_) {}
        try {
          const { useUserStore } = await import('../store/userStore.js')
          useUserStore().setToken(newToken)
        } catch (_) {}
      }
    }

    // Update local displayed info as well (UI reflects immediately)
    userInfo.name = profileForm.name
    userInfo.email = profileForm.email

    profileSuccess.value = true
    profileForm.editable = false
  } catch (e) {
    profileError.value = e?.response?.data?.message || e?.message || 'Failed to update profile'
  } finally {
    submittingProfile.value = false
    // hide success after a while
    if (profileSuccess.value) setTimeout(() => { profileSuccess.value = false }, 3000)
  }
}

async function changePassword() {
  console.log("Clicked");
  console.log(passwordForm.editable);
  if (!passwordForm.editable) return
  passwordMessage.value = ''
  passwordError.value = ''
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    passwordError.value = 'Please fill all password fields'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Passwords do not match!'
    return
  }
  try {
    const userId = userStore.state._id || 'me'
    const body = {
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      confirm_password: passwordForm.confirmPassword,
    }
    const { status, data } = await api.post(`/user/${encodeURIComponent(userId)}/change-password`, body)
    if (status === 200) {
      passwordMessage.value = data?.message || 'Password changed successfully'
      passwordError.value = ''
      passwordSuccess.value = true
      // Optionally clear form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      // toggle off edit
      passwordForm.editable = false
      setTimeout(() => { passwordSuccess.value = false; passwordMessage.value = '' }, 3000)
    } else {
      passwordError.value = data?.error || 'Failed to change password'
      passwordMessage.value = ''
    }
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || 'Failed to change password'
    passwordError.value = msg
    passwordMessage.value = ''
  }
}


// Persist edit mode across reloads (optional)
onMounted(() => {
  const saved = localStorage.getItem('profile.editable')
  if (saved !== null) {
    profileForm.editable.value = saved === '0'
  }
})
watch(profileForm.editable, (v) => {
  localStorage.setItem('profile.editable', v ? '1' : '0')
})

</script>