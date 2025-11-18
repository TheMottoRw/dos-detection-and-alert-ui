<template>
  <div class="max-w-12xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- <CHANGE> Added search header section -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-gray-900">Logs history</h2>
        </div>
        <!-- Processing loader shown under title while response is being processed -->
        <div v-if="processing" class="mb-2 flex items-center text-blue-700">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="text-sm">{{ processingMessage }}</p>
        </div>
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
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="col-span-1 relative">
            <label for="search" class="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by IP, action or message..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label for="action-filter" class="block text-xs font-medium text-gray-600 mb-1">Action</label>
            <select
              id="action-filter"
              v-model="actionFilter"
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
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

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <!-- Render from paginated logs -->
          <template v-if="paginatedLogs.length > 0">
            <template v-for="logs in paginatedLogs" :key="logs._id">
              <tr
                  @click="toggleExpand(logs._id)"
                  class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  :class="{ 'bg-blue-50': expandedRows.includes(logs._id) }"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        {{ logs.ip }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ logs.action }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ logs.message }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ logs.createdAt.replaceAll("T"," ").substring(0,16) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-2">
<!--                    <button @click.stop="openEditModal(logs)" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">-->
<!--                      Edit-->
<!--                    </button>-->
                    <button @click.stop="openDeleteModal(logs)" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

            </template>
          </template>

          <!-- No results message -->
          <tr v-else>
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                </svg>
                <p class="text-lg font-medium text-gray-900 mb-1">No logs found</p>
                <p class="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination footer -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
        <div class="text-sm text-gray-600">
          <span v-if="totalCount > 0">Showing {{ startItem }}–{{ endItem }} of {{ totalCount }} logs</span>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <button class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40" :disabled="currentPage === 1" @click="prevPage">Prev</button>
          <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40" :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage">Next</button>
        </div>
      </div>
    </div>

    <!-- Add Website Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeAddModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add new website</h3>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="url-input">Website URL</label>
        <input id="url-input" v-model="newUrl" type="text" placeholder="https://example.com" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
        <p v-if="addValidationError" class="text-sm text-red-600 mt-2">{{ addValidationError }}</p>
        <p v-if="addError" class="text-sm text-red-600 mt-2">{{ addError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeAddModal" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="savingAdd">Cancel</button>
          <button @click="saveNewWebsite" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60" :disabled="savingAdd">
            <span v-if="savingAdd">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </div>

    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeDeleteModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm delete</h3>
        <p class="text-sm text-gray-700">Are you sure you want to delete <span class="font-semibold">{{ deleteTarget?.domain_name }}</span>? This action cannot be undone.</p>
        <p v-if="deleteError" class="text-sm text-red-600 mt-2">{{ deleteError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeDeleteModal" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="deleting">Cancel</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-60" :disabled="deleting">
            <span v-if="deleting">Deleting...</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </div>
    </div>

    
    <!-- Edit Classification Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeEditModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit logs</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="sitename-input">Site name</label>
            <input id="sitename-input" v-model="editForm.siteName" type="text" placeholder="example.com" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="category-input">Category</label>
            <input id="category-input" v-model="categorySearch" type="text" placeholder="Search or select category" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" @focus="dropdownOpen = true" @input="dropdownOpen = true" />
            <!-- Dropdown -->
            <div v-if="dropdownOpen" class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-auto shadow-lg">
              <div v-if="filteredCategoryOptions.length === 0" class="px-3 py-2 text-sm text-gray-500">No matches</div>
              <button v-for="opt in filteredCategoryOptions" :key="opt" type="button" class="w-full text-left px-3 py-2 hover:bg-gray-100" @click="selectCategory(opt)">{{ opt }}</button>
            </div>
            <!-- Selected pill -->
            <div v-if="editForm.category" class="mt-2 inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {{ editForm.category }}
            </div>
          </div>
          <p v-if="editValidationError" class="text-sm text-red-600">{{ editValidationError }}</p>
          <p v-if="editError" class="text-sm text-red-600">{{ editError }}</p>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeEditModal" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="savingEdit">Cancel</button>
          <button @click="updateClassification" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60" :disabled="savingEdit">
            <span v-if="savingEdit">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import api from '../services/http.js'

// Filters & pagination state
const searchQuery = ref('')
const actionFilter = ref('all') // all | <action>
const pageSize = ref(10)
const currentPage = ref(1)
const expandedRows = ref([])

const logs = ref([])

// simple loading and error state for UX
const loading = ref(false)
const error = ref(null)

// processing loader (under title) shown while saving and refreshing
const processing = ref(false)
const processingMessage = ref('')
// Page-scoped notification banner (kept minimal; used by template banner)
const noticeMessage = ref('')
const noticeType = ref('success')
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

function showNotice(msg, type = 'success', timeoutMs = 3000) {
  noticeMessage.value = msg
  noticeType.value = type
  noticeVisible.value = true
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => hideNotice(), timeoutMs)
}

// Base API URL from Vite env (.env should define VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USER_ID = import.meta.env.VITE_USER_ID || ''

async function fetchLogs() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/logs`)
    // Expecting an array of logs objects
    logs.value = Array.isArray(data) ? data : (data?.items || [])
  } catch (e) {
    error.value = e?.message || 'Failed to load logs'
    console.error('Failed to load logs', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
  // preload categories if API exists (optional)
})

onBeforeUnmount(() => {
  clearTimeout(noticeTimer)
})

// Delete modal state
const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteError = ref(null)
const deleteTarget = ref(null)

function openDeleteModal(logs) {
  deleteError.value = null
  deleteTarget.value = logs
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteError.value = null
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value?._id) return
  deleting.value = true
  processing.value = true
  processingMessage.value = 'Deleting logs...'
  try {
    // Requirement: send delete request to logs/<id>/delete
    const { data } = await api.post(`/log/${deleteTarget.value._id}/delete`)
    // Remove from local list
    logs.value = logs.value.filter(c => c._id !== deleteTarget.value._id)
    // Notify
    const msg = data?.message || 'Log deleted successfully'
    showNotice(msg, 'success')
    closeDeleteModal()
  } catch (e) {
    deleteError.value = e?.response?.data?.message || e?.message || 'Failed to delete logs'
    console.error('Failed to delete logs', e)
    showNotice(deleteError.value, 'error')
  } finally {
    deleting.value = false
    processing.value = false
    processingMessage.value = ''
  }
}

// Edit modal state
const showEditModal = ref(false)
const savingEdit = ref(false)
const editError = ref(null)
const editValidationError = ref(null)
const dropdownOpen = ref(false)

const editForm = ref({
  id: '',
  siteName: '',
  category: ''
})

// If you have a categories API, you could fetch it. For now, use a static list as fallback.
const categoryOptions = ref([
  'Business', 'Technology', 'Education', 'Entertainment', 'Health', 'Science', 'Sport', 'Politics', 'Travel', 'Lifestyle', 'Finance', 'E-commerce', 'News', 'Gaming', 'Food'
])

const categorySearch = ref('')
const filteredCategoryOptions = computed(() => {
  const q = categorySearch.value.toLowerCase().trim()
  const list = categoryOptions.value || []
  if (!q) return list
  return list.filter(opt => opt.toLowerCase().includes(q))
})

function openEditModal(logs) {
  editError.value = null
  editValidationError.value = null
  dropdownOpen.value = false
  showEditModal.value = true
  categorySearch.value = logs.category || ''
  editForm.value = {
    id: logs._id,
    siteName: logs.domain_name || '',
    category: logs.category || ''
  }
}

function closeEditModal() {
  showEditModal.value = false
  editError.value = null
  editValidationError.value = null
  dropdownOpen.value = false
}

function selectCategory(opt) {
  editForm.value.category = opt
  categorySearch.value = opt
  dropdownOpen.value = false
}

async function updateClassification() {
  editError.value = null
  editValidationError.value = null
  if (!editForm.value.siteName) {
    editValidationError.value = 'Site name is required.'
    return
  }
  if (!editForm.value.category) {
    editValidationError.value = 'Please choose a category.'
    return
  }
  savingEdit.value = true
  processing.value = true
  processingMessage.value = 'Updating logs...'
  try {
    const payload = {
      domain_name: editForm.value.siteName,
      category: editForm.value.category
    }
    // Endpoint per requirement: logs/<id>
    await api.post(`/logs/${editForm.value.id}`, payload)

    // Update in-place to avoid refetching whole list
    const idx = logs.value.findIndex(c => c._id === editForm.value.id)
    if (idx !== -1) {
      logs.value[idx] = {
        ...logs.value[idx],
        domain_name: payload.domain_name,
        category: payload.category
      }
    }
    showNotice('Classification updated', 'success')
    closeEditModal()
  } catch (e) {
    editError.value = e?.response?.data?.message || e?.message || 'Failed to update logs'
    console.error('Failed to update logs', e)
    showNotice(editError.value, 'error')
  } finally {
    savingEdit.value = false
    processing.value = false
    processingMessage.value = ''
  }
}

// Build normalized logs for flexible filtering
const normalized = computed(() => (logs.value || []).map(l => ({
  ...l,
  _norm_ip: (l.ip || '').toString().toLowerCase(),
  _norm_action: (l.action || '').toString().toLowerCase(),
  _norm_message: (l.message || '').toString().toLowerCase(),
})))

// Unique available actions for the Action filter
const actions = computed(() => {
  const set = new Set((logs.value || []).map(l => (l.action || '').toString().toLowerCase()).filter(Boolean))
  return Array.from(set).sort()
})

// Apply search + action filters
const filteredLogs = computed(() => {
  let list = normalized.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(l => l._norm_ip.includes(q) || l._norm_action.includes(q) || l._norm_message.includes(q))
  }
  if (actionFilter.value !== 'all') {
    const af = (actionFilter.value || '').toLowerCase()
    list = list.filter(l => l._norm_action === af)
  }
  // return original objects
  return list.map(({ _norm_ip, _norm_action, _norm_message, ...orig }) => orig)
})

// Pagination derivations
const totalCount = computed(() => filteredLogs.value.length)
const totalPages = computed(() => (totalCount.value === 0 ? 0 : Math.ceil(totalCount.value / pageSize.value)))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLogs.value.slice(start, start + pageSize.value)
})
const startItem = computed(() => totalCount.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalCount.value))

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }

// Watchers: reset/clamp page when inputs/data change
watch([searchQuery, actionFilter, pageSize], () => { currentPage.value = 1 })
watch([filteredLogs, pageSize], () => {
  const tp = totalPages.value
  if (tp > 0 && currentPage.value > tp) currentPage.value = tp
  if (tp === 0) currentPage.value = 1
})

const toggleExpand = (logsId) => {
  const index = expandedRows.value.indexOf(logsId)
  console.log(index)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    console.log(logsId)
    expandedRows.value.push(logsId)
  }
}


// Add Website Modal state and actions
const showAddModal = ref(false)
const newUrl = ref('')
const savingAdd = ref(false)
const addError = ref(null)
const addValidationError = ref(null)

function openAddModal() {
  addError.value = null
  addValidationError.value = null
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  newUrl.value = ''
  addError.value = null
  addValidationError.value = null
}

function isValidUrl(value) {
  try {
    // URL constructor will throw for invalid URLs
    new URL(value)
    return true
  } catch (_) {
    return false
  }
}

async function saveNewWebsite() {
  addError.value = null
  addValidationError.value = null
  if (!newUrl.value || !isValidUrl(newUrl.value)) {
    addValidationError.value = 'Please enter a valid URL.'
    return
  }

  savingAdd.value = true
  processing.value = true
  processingMessage.value = 'Processing your website logs, please wait...'
  try {
    await api.post(`/classify`, { url: newUrl.value, userId: `${USER_ID}` })
    // Success notice
    showNotice('Website saved and classified', 'success')
    closeAddModal()
    // Refresh logs after saving
    await fetchLogs()
  } catch (e) {
    addError.value = e?.response?.data?.message || e?.message || 'Failed to save website'
    console.error('Failed to save website', e)
    showNotice(addError.value, 'error')
  } finally {
    savingAdd.value = false
    processing.value = false
    processingMessage.value = ''
  }
}

</script>

<style scoped>
/* Simple fade transition for the notification banner */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>