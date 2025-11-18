<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-gray-900">Users</h2>
          <button @click="openAdd" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Add user
          </button>
        </div>
        <div v-if="loading" class="mb-2 flex items-center text-blue-700">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="text-sm">Loading users...</p>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <!-- Global notification banner -->
        <transition name="fade">
          <div
            v-if="noticeVisible"
            :class="[
              'mt-3 p-3 rounded-md border text-sm',
              noticeType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            ]"
            role="status"
            aria-live="polite"
          >
            {{ noticeMessage }}
          </div>
        </transition>

        <!-- Filters -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="col-span-1">
            <label for="search" class="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label for="status-filter" class="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              id="status-filter"
              v-model="statusFilter"
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="role-filter" class="block text-xs font-medium text-gray-600 mb-1">Role</label>
            <select
              id="role-filter"
              v-model="roleFilter"
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="col-span-1">
            <label for="page-size" class="block text-xs font-medium text-gray-600 mb-1">Rows per page</label>
            <select
              id="page-size"
              v-model.number="pageSize"
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!loading && filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-6 text-center text-gray-500">No users found. Click "Add user" to create one.</td>
            </tr>
            <tr v-for="(u, idx) in paginatedUsers" :key="u._id || u.id || (u.email || u.name) + idx">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ u.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ u.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{{ u.userType || 'user' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
                    (u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')
                  ]">
                  {{ u.status || 'unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <button @click="openEdit(u)" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="u.__saving">Edit</button>
                  <button @click="toggleStatus(u)" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" :disabled="u.__saving">
                    {{ u.status === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button @click="openReset(u)" class="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700" :disabled="u.__saving">Reset password</button>
                  <button @click="removeUser(u)" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" :disabled="u.__saving">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination footer -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
        <div class="text-sm text-gray-600">
          <span v-if="totalCount > 0">
            Showing {{ startItem }}–{{ endItem }} of {{ totalCount }} users
          </span>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <button class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40" :disabled="currentPage === 1" @click="prevPage">Prev</button>
          <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40" :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage">Next</button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeAdd"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add new user</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="user-name-input">Name</label>
            <input id="user-name-input" v-model="form.name" type="text" placeholder="Jane Doe" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="user-email-input">Email</label>
            <input id="user-email-input" v-model="form.email" type="email" placeholder="jane@example.com" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="user-role-input">Role</label>
            <select id="user-role-input" v-model="form.role" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="user-password-input">Password</label>
            <input id="user-password-input" v-model="form.password" type="password" placeholder="••••••••" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <p v-if="validationError" class="text-sm text-red-600 mt-2">{{ validationError }}</p>
        <p v-if="addError" class="text-sm text-red-600 mt-2">{{ addError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeAdd" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="saving">Cancel</button>
          <button @click="submitAdd" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" :disabled="saving">
            {{ saving ? 'Saving...' : 'Add user' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeEdit"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit user</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="edit-name-input">Name</label>
            <input id="edit-name-input" v-model="editForm.name" type="text" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="edit-email-input">Email</label>
            <input id="edit-email-input" v-model="editForm.email" type="email" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="edit-role-input">Role</label>
            <select id="edit-role-input" v-model="editForm.role" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <p v-if="editValidationError" class="text-sm text-red-600 mt-2">{{ editValidationError }}</p>
        <p v-if="editError" class="text-sm text-red-600 mt-2">{{ editError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeEdit" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="savingEdit">Cancel</button>
          <button @click="submitEdit" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" :disabled="savingEdit">
            {{ savingEdit ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showReset" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeReset"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reset password</h3>
        <p class="text-sm text-gray-600 mb-2">User: <span class="font-medium text-gray-900">{{ resettingUser?.name }} ({{ resettingUser?.email }})</span></p>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="new-password-input">New password</label>
        <input id="new-password-input" v-model="resetPassword" type="password" placeholder="••••••••" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
        <label class="block text-sm font-medium text-gray-700 mb-1" for="new-password-input">Confirm password</label>
        <input id="new-password-input" v-model="confirmPassword" type="password" placeholder="••••••••" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
        <p v-if="resetError" class="text-sm text-red-600 mt-2">{{ resetError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeReset" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="resetSaving">Cancel</button>
          <button @click="submitReset" class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50" :disabled="resetSaving">
            {{ resetSaving ? 'Applying…' : 'Apply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import api from '../services/http.js'

const users = ref([])
const loading = ref(false)
const error = ref('')

// Lightweight notification system
const noticeMessage = ref('')
const noticeType = ref('success') // 'success' | 'error'
const noticeVisible = ref(false)
let noticeTimer = null

function hideNotice() {
  noticeVisible.value = false
  noticeMessage.value = ''
  if (noticeTimer) {
    clearTimeout(noticeTimer)
    noticeTimer = null
  }
}

function showNotice(msg, type = 'success', timeoutMs = 3500) {
  noticeMessage.value = msg
  noticeType.value = type
  noticeVisible.value = true
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    hideNotice()
  }, timeoutMs)
}

// Filters & pagination
const searchQuery = ref('')
const statusFilter = ref('all')
const roleFilter = ref('all')
const pageSize = ref(10)
const currentPage = ref(1)

// Derived roles from data (unique)
const roles = computed(() => {
  const set = new Set((users.value || []).map(u => (u.userType || 'user').toLowerCase()).filter(Boolean))
  return Array.from(set).sort()
})

const normalized = computed(() => (users.value || []).map(u => ({
  ...u,
  _norm_name: (u.name || '').toLowerCase(),
  _norm_email: (u.email || '').toLowerCase(),
  _norm_status: (u.status || '').toLowerCase(),
  _norm_role: (u.role || '').toLowerCase(),
})))

const filteredUsers = computed(() => {
  let list = normalized.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(u => u._norm_name.includes(q) || u._norm_email.includes(q))
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(u => u._norm_status === statusFilter.value)
  }
  if (roleFilter.value !== 'all') {
    const rf = (roleFilter.value || '').toLowerCase()
    list = list.filter(u => u._norm_role === rf)
  }
  return list.map(({ _norm_name, _norm_email, _norm_status, _norm_role, ...orig }) => orig)
})

const totalCount = computed(() => filteredUsers.value.length)
const totalPages = computed(() => (totalCount.value === 0 ? 0 : Math.ceil(totalCount.value / pageSize.value)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})
const startItem = computed(() => totalCount.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalCount.value))

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }

watch([searchQuery, statusFilter, roleFilter, pageSize], () => { currentPage.value = 1 })
watch([filteredUsers, pageSize], () => {
  const tp = totalPages.value
  if (tp > 0 && currentPage.value > tp) currentPage.value = tp
  if (tp === 0) currentPage.value = 1
})

// Fetch
async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/users')
    users.value = Array.isArray(data) ? data : (data?.items || [])
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// Add user modal
const showAdd = ref(false)
const form = ref({ name: '', email: '', role: 'user', password: '' })
const validationError = ref('')
const addError = ref('')
const saving = ref(false)

function openAdd() {
  showAdd.value = true
  form.value = { name: '', email: '', role: 'user', password: '' }
  validationError.value = ''
  addError.value = ''
}
function closeAdd() { if (!saving.value) showAdd.value = false }

function validateAdd(f) {
  if (!f.name?.trim()) return 'Name is required'
  if (!f.email?.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Email is invalid'
  if (!f.password || f.password.length < 5) return 'Password must be at least 6 characters'
  return ''
}

async function submitAdd() {
  addError.value = ''
  validationError.value = validateAdd(form.value)
  if (validationError.value) return
  saving.value = true
  try {
    const payload = { name: form.value.name, email: form.value.email, role: form.value.role, password: form.value.password }
    const { data } = await api.post('/user', payload)
    let created = data
    if (!created || !created.id && !created._id) {
      created = { ...payload, id: data?.id || data?._id, _id: data?._id || data?.id, status: 'active' }
    }
    users.value.unshift(created)
    await fetchUsers()
  } catch (e) {
    addError.value = e?.response?.data?.message || e?.message || 'Could not add user'
  } finally {
    saving.value = false
    // Always close the dialog after the request has executed (success or error)
    closeAdd()
  }
}

// Edit user modal
const showEdit = ref(false)
const editingUser = ref(null)
const editForm = ref({ name: '', email: '', role: 'user' })
const editValidationError = ref('')
const editError = ref('')
const savingEdit = ref(false)

function openEdit(u) {
  editingUser.value = u
  // Preselect role based on the user's current type/role. Backend may provide either `userType` or `role`.
  const currentRole = (u.role || u.userType || 'user')
  editForm.value = { name: u.name || '', email: u.email || '', role: String(currentRole).toLowerCase() }
  editValidationError.value = ''
  editError.value = ''
  showEdit.value = true
}
function closeEdit() { if (!savingEdit.value) showEdit.value = false }

function validateEdit(f) {
  if (!f.name?.trim()) return 'Name is required'
  if (!f.email?.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Email is invalid'
  return ''
}

async function submitEdit() {
  editError.value = ''
  editValidationError.value = validateEdit(editForm.value)
  if (editValidationError.value) return
  if (!editingUser.value) return
  savingEdit.value = true
  try {
    const id = editingUser.value._id || editingUser.value.id
    if (!id) throw new Error('Missing user id')
    await api.post(`/user/${id}`, { name: editForm.value.name, email: editForm.value.email, role: editForm.value.role })
    editingUser.value.name = editForm.value.name
    editingUser.value.email = editForm.value.email
    editingUser.value.role = editForm.value.role
    await fetchUsers()
    showNotice('User details updated successfully', 'success')
  } catch (e) {
    editError.value = e?.response?.data?.message || e?.message || 'Could not update user'
    showNotice(editError.value, 'error')
  } finally {
    savingEdit.value = false
    // Always close after execution
    closeEdit()
  }
}

// Toggle status
async function toggleStatus(u) {
  try {
    u.__saving = true
    const next = (u.status === 'active') ? 'deactive' : 'active'
    const route = (u.status === 'active') ? 'lock' : 'unlock'
    const id = u._id || u.id
    if (id) {
      await api.post(`/user/${id}/${route}`, { status: next })
    }
    u.status = next
    await fetchUsers()
    showNotice(`User ${next === 'active' ? 'activated' : 'deactivated'} successfully`, 'success')
  } catch (e) {
    console.error(e)
    const msg = e?.response?.data?.message || e?.message || 'Failed to change status'
    showNotice(msg, 'error')
  } finally {
    u.__saving = false
  }
}

// Delete user
async function removeUser(u) {
  if (!confirm(`Delete ${u.name || u.email}?`)) return
  try {
    u.__saving = true
    const id = u._id || u.id
    if (id) {
      await api.post(`/user/${id}/delete`)
    }
    users.value = users.value.filter(x => x !== u)
  } catch (e) {
    console.error(e)
    alert(e?.response?.data?.message || e?.message || 'Failed to delete user')
  } finally {
    u.__saving = false
  }
}

// Reset password
const showReset = ref(false)
const resettingUser = ref(null)
const resetPassword = ref('')
const confirmPassword = ref('')
const resetError = ref('')
const resetSaving = ref(false)

function openReset(u) {
  resettingUser.value = u
  resetPassword.value = ''
  confirmPassword.value = ''
  resetError.value = ''
  showReset.value = true
}
function closeReset() { if (!resetSaving.value) showReset.value = false }

async function submitReset() {
  resetError.value = ''
  if (!resetPassword.value || resetPassword.value.length < 5 || !confirmPassword.value || confirmPassword.value.length < 5) {
    resetError.value = 'Password must be at least 5 characters'
    return
  }
  if (resetPassword.value!== confirmPassword.value) {
    resetError.value = 'Password does not match'
    return
  }
  if (!resettingUser.value) return
  resetSaving.value = true
  try {
    const id = resettingUser.value._id || resettingUser.value.id
    if (!id) throw new Error('Missing user id')
    await api.post(`/user/${id}/reset-password`, { password: resetPassword.value })
    showNotice('Password reset successfully', 'success')
  } catch (e) {
    resetError.value = e?.response?.data?.message || e?.message || 'Could not reset password'
    showNotice(resetError.value, 'error')
  } finally {
    resetSaving.value = false
    // Always close after request completes
    closeReset()
  }
}
</script>

<style scoped>
/* Simple fade transition for the banner */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
