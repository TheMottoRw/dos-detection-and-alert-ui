<template>
  <div class="max-w-12xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- <CHANGE> Added search header section -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-gray-900">Keyword history</h2>
          <button @click="openAddModal" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Add keyword
          </button>
        </div>
        <!-- Processing loader shown under title while response is being processed -->
        <div v-if="processing" class="mb-2 flex items-center text-blue-700">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="text-sm">{{ processingMessage }}</p>
        </div>
        <!-- Success message banner -->
        <div v-if="successMessage" class="mb-4 flex items-center text-green-700">
          <svg class="-ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-sm">{{ successMessage }}</p>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by keyword..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <!-- <CHANGE> Updated to use filteredKeywords instead of keywords -->
          <template v-if="filteredKeywords.length > 0">
            <template v-for="keyword in filteredKeywords" :key="keyword._id">
              <tr
                  @click="toggleExpand(keyword._id)"
                  class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  :class="{ 'bg-blue-50': expandedRows.includes(keyword._id) }"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ keyword.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ keyword.createdAt.replaceAll("T"," ").substring(0,16) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-2">
                    <button @click.stop="openEditModal(keyword)" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    <button @click.stop="openDeleteModal(keyword)" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

           </template>
          </template>

          <!-- <CHANGE> Added no results message -->
          <tr v-else>
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                </svg>
                <p class="text-lg font-medium text-gray-900 mb-1">No keywords found</p>
                <p class="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Website Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeAddModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add new keyword</h3>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="url-input">Keyword</label>
        <input id="url-input" v-model="newUrl" type="text" placeholder="Technology" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
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

    
    <!-- Edit Keyword Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeEditModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit keyword</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="name-input">Keyword</label>
            <input id="name-input" v-model="editForm.name" type="text" placeholder="Health" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <p v-if="editValidationError" class="text-sm text-red-600">{{ editValidationError }}</p>
          <p v-if="editError" class="text-sm text-red-600">{{ editError }}</p>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeEditModal" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="savingEdit">Cancel</button>
          <button @click="updateKeyword" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60" :disabled="savingEdit">
            <span v-if="savingEdit">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from '../services/http.js'

// <CHANGE> Added searchQuery reactive variable
const searchQuery = ref('')
const expandedRows = ref([])

const keywords = ref([])

// simple loading and error state for UX
const loading = ref(false)
const error = ref(null)

// processing loader (under title) shown while saving and refreshing
const processing = ref(false)
const processingMessage = ref('')
// success banner message for non-intrusive feedback
const successMessage = ref('')
let successTimer = null

// Base API URL from Vite env (.env should define VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USER_ID = import.meta.env.VITE_USER_ID || ''

async function fetchKeywords() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/keywords`)
    // Expecting an array of keyword objects
    keywords.value = Array.isArray(data) ? data : (data?.items || [])
  } catch (e) {
    error.value = e?.message || 'Failed to load keywords'
    console.error('Failed to load keywords', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchKeywords()
  // preload categories if API exists (optional)
})

onBeforeUnmount(() => {
  clearTimeout(successTimer)
})

// Delete modal state
const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteError = ref(null)
const deleteTarget = ref(null)

function openDeleteModal(keyword) {
  deleteError.value = null
  deleteTarget.value = keyword
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
  processingMessage.value = 'Deleting keyword...'
  try {
    // Requirement: send delete request to keyword/<id>/delete
    const { data } = await api.post(`/keyword/${deleteTarget.value._id}/delete`)
    // Remove from local list
    keywords.value = keywords.value.filter(c => c._id !== deleteTarget.value._id)
    // Show server response as success text
    const msg = data?.message || 'Deleted successfully'
    successMessage.value = msg
    clearTimeout(successTimer)
    successTimer = setTimeout(() => { successMessage.value = '' }, 3000)
    closeDeleteModal()
  } catch (e) {
    deleteError.value = e?.response?.data?.message || e?.message || 'Failed to delete keyword'
    console.error('Failed to delete keyword', e)
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

function openEditModal(keyword) {
  editError.value = null
  editValidationError.value = null
  dropdownOpen.value = false
  showEditModal.value = true
  categorySearch.value = keyword.category || ''
  editForm.value = {
    id: keyword._id,
    name: keyword.name || ''
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

async function updateKeyword() {
  editError.value = null
  editValidationError.value = null
  if (!editForm.value.name) {
    editValidationError.value = 'Site name is required.'
    return
  }
  savingEdit.value = true
  processing.value = true
  processingMessage.value = 'Updating keyword...'
  try {
    const payload = {
      name: editForm.value.name
    }
    // Endpoint per requirement: keyword/<id>
    await api.post(`/keyword/${editForm.value.id}`, payload)

    // Update in-place to avoid refetching whole list
    const idx = keywords.value.findIndex(c => c._id === editForm.value.id)
    if (idx !== -1) {
      keywords.value[idx] = {
        ...keywords.value[idx],
        name: payload.name
      }
    }
    successMessage.value = 'Keyword updated'
    // auto-hide success after 3 seconds
    clearTimeout(successTimer)
    successTimer = setTimeout(() => { successMessage.value = '' }, 3000)
    closeEditModal()
  } catch (e) {
    editError.value = e?.response?.data?.message || e?.message || 'Failed to update keyword'
    console.error('Failed to update keyword', e)
  } finally {
    savingEdit.value = false
    processing.value = false
    processingMessage.value = ''
  }
}

// <CHANGE> Added computed property for filtered keywords based on search
const filteredKeywords = computed(() => {
  if (!searchQuery.value) {
    return keywords.value
  }

  const query = searchQuery.value.toLowerCase()
  return keywords.value.filter(keyword =>
      (keyword.name || '').toLowerCase().includes(query)
  )
})

const toggleExpand = (keywordId) => {
  const index = expandedRows.value.indexOf(keywordId)
  console.log(index)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    console.log(keywordId)
    expandedRows.value.push(keywordId)
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
  if (!newUrl.value) {
    addValidationError.value = 'Please enter a valid URL.'
    return
  }

  savingAdd.value = true
  processing.value = true
  processingMessage.value = 'Processing your keyword, please wait...'
  try {
    await api.post(`/keyword`, { name: newUrl.value })
    // Show success message upon receiving response
    successMessage.value = 'Saved keyword'
    clearTimeout(successTimer)
    successTimer = setTimeout(() => { successMessage.value = '' }, 3000)
    closeAddModal()
    // Refresh keywords after saving
    await fetchKeywords()
  } catch (e) {
    addError.value = e?.response?.data?.message || e?.message || 'Failed to save keyword'
    console.error('Failed to save keyword', e)
  } finally {
    savingAdd.value = false
    processing.value = false
    processingMessage.value = ''
  }
}

</script>