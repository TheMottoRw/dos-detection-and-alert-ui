<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-gray-900">Websites</h2>
          <button @click="openAdd" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Add website
          </button>
        </div>
        <div v-if="loading" class="mb-2 flex items-center text-blue-700">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="text-sm">Loading websites...</p>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <!-- Filters -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="col-span-1">
            <label for="search" class="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or status..."
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
              <option value="defaced">Defaced</option>
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">site_name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">site_status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">action</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!loading && filteredWebsites.length === 0">
              <td colspan="4" class="px-6 py-6 text-center text-gray-500">No websites yet. Click "Add website" to create one.</td>
            </tr>
            <tr v-for="(site, idx) in paginatedWebsites" :key="site._id || site.id || (site.site_name || site.name) + idx">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ site.site_name || site.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
                    (site.site_status === 'active' ? 'bg-green-100 text-green-800' :  (site.site_status === 'defaced' ? 'bg-red-100 text-red-800':'bg-gray-100 text-gray-800'))
                  ]">
                  {{ (site.site_status || site.status) || 'unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-2">
                  <button @click="openEdit(site)" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="site.__saving">
                    Edit
                  </button>
                  <button @click="toggleStatus(site)" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" :disabled="site.__saving">
                    {{ (site.site_status || site.status) === 'active' ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button @click="removeSite(site)" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" :disabled="site.__saving">
                    Delete
                  </button>
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
            Showing {{ startItem }}–{{ endItem }} of {{ totalCount }} websites
          </span>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <button
            class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            Prev
          </button>
          <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="px-3 py-1.5 border rounded-md text-sm disabled:opacity-40"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add Website Modal -->
    <div v-if="showAdd" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeAdd"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add new website</h3>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="site-name-input">Website name</label>
        <input id="site-name-input" v-model="newSiteName" type="text" placeholder="example.com" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
        <p v-if="validationError" class="text-sm text-red-600 mt-2">{{ validationError }}</p>
        <p v-if="addError" class="text-sm text-red-600 mt-2">{{ addError }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeAdd" class="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors" :disabled="saving">Cancel</button>
          <button @click="submitAdd" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" :disabled="saving">
            {{ saving ? 'Saving...' : 'Add website' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Website Modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeEdit"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Edit website</h3>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="edit-site-name-input">Website name</label>
        <input id="edit-site-name-input" v-model="editSiteName" type="text" placeholder="example.com" class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import api from '../services/http.js'

const websites = ref([])
const loading = ref(false)
const error = ref('')

const showAdd = ref(false)
const newSiteName = ref('')
const validationError = ref('')
const addError = ref('')
const saving = ref(false)

// Edit modal state
const showEdit = ref(false)
const editSiteName = ref('')
const editValidationError = ref('')
const editError = ref('')
const savingEdit = ref(false)
const editingSite = ref(null)

// Filter & pagination state
const searchQuery = ref('')
const statusFilter = ref('all') // all | active | deactive | defaced
const pageSize = ref(10)
const currentPage = ref(1)

const normalizedItems = computed(() => {
  // Normalize status field for filtering/sorting convenience
  return (websites.value || []).map(s => ({
    ...s,
    _norm_status: (s.site_status || s.status || '').toString().toLowerCase(),
    _norm_name: (s.site_name || s.name || '').toString().toLowerCase()
  }))
})

const filteredWebsites = computed(() => {
  let list = normalizedItems.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(s => s._norm_name.includes(q) || s._norm_status.includes(q))
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(s => s._norm_status === statusFilter.value)
  }
  // Return original objects (without helper props) to keep reactivity on actions
  return list.map(({ _norm_status, _norm_name, ...orig }) => orig)
})

const totalCount = computed(() => filteredWebsites.value.length)
const totalPages = computed(() => (totalCount.value === 0 ? 0 : Math.ceil(totalCount.value / pageSize.value)))

const paginatedWebsites = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredWebsites.value.slice(start, start + pageSize.value)
})

const startItem = computed(() => totalCount.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalCount.value))

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Reset to first page when filters change
watch([searchQuery, statusFilter, pageSize], () => {
  currentPage.value = 1
})

// Clamp page when data changes
watch([filteredWebsites, pageSize], () => {
  const tp = totalPages.value
  if (tp > 0 && currentPage.value > tp) currentPage.value = tp
  if (tp === 0) currentPage.value = 1
})

function openAdd() {
  showAdd.value = true
  newSiteName.value = ''
  validationError.value = ''
  addError.value = ''
}
function closeAdd() {
  if (saving.value) return
  showAdd.value = false
}

async function fetchWebsites() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/websites')
    // Expecting array of sites with fields: site_name, site_status, _id
    websites.value = Array.isArray(data) ? data : (data?.items || [])
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to load websites'
  } finally {
    loading.value = false
  }
}

function validateSiteName(name) {
  if (!name || !name.trim()) return 'Website name is required'
  // Basic sanity: could be domain or URL; keep it simple.
  if (name.length > 255) return 'Website name is too long'
  return ''
}

async function submitAdd() {
  addError.value = ''
  validationError.value = validateSiteName(newSiteName.value)
  if (validationError.value) return
  saving.value = true
  try {
    const payload = { name: newSiteName.value }
    const { data } = await api.post('/website', payload)

    // Backend may return full site or only the id. Normalize the result.
    let createdSite
    if (data && (data.site_name || data.name)) {
      createdSite = data
    } else {
      const id = (data && (data._id || data.id || data.insertedId)) || (typeof data === 'string' ? data : undefined)
      createdSite = {
        _id: id,
        id: id,
        site_name: newSiteName.value,
        site_status: 'active',
        status: 'active'
      }
    }
    websites.value.unshift(createdSite)
  } catch (e) {
    addError.value = e?.response?.data?.message || e?.message || 'Could not add website'
  } finally {
    saving.value = false
    // Always close the dialog after the request has executed (success or error)
    closeAdd()
  }
}

function openEdit(site) {
  editingSite.value = site
  editSiteName.value = site.site_name || site.name || ''
  editValidationError.value = ''
  editError.value = ''
  showEdit.value = true
}
function closeEdit() {
  if (savingEdit.value) return
  showEdit.value = false
}

async function submitEdit() {
  editError.value = ''
  editValidationError.value = validateSiteName(editSiteName.value)
  if (editValidationError.value) return
  if (!editingSite.value) return
  savingEdit.value = true
  try {
    const id = editingSite.value._id || editingSite.value.id
    if (!id) throw new Error('Missing website id')
    // Backend pattern: POST /website/:id with changed fields
    await api.post(`/website/${id}`, { name: editSiteName.value })
    if ('site_name' in editingSite.value) editingSite.value.site_name = editSiteName.value
    else editingSite.value.name = editSiteName.value
  } catch (e) {
    editError.value = e?.response?.data?.message || e?.message || 'Could not update website'
  } finally {
    savingEdit.value = false
    // Always close after the request has executed (success or error)
    closeEdit()
  }
}

async function toggleStatus(site) {
  try {
    site.__saving = true
    const current = site.status || site.site_status
    const next = current === 'active' ? 'deactive' : 'active'
    const id = site._id || site.id
    if (id) {
      await api.post(`/website/${id}`, { status: next })
    }
    // Keep both fields in sync for compatibility with UI and older data
    site.status = next
    if ('site_status' in site) site.site_status = next
    // After a successful toggle, refetch to ensure the list reflects backend state
    // and pagination/filtering stay consistent with server data.
    await fetchWebsites()
  } catch (e) {
    console.error(e)
    // optionally show toast
  } finally {
    site.__saving = false
  }
}

async function removeSite(site) {
  if (!confirm(`Delete ${site.site_name || site.name}?`)) return
  try {
    site.__saving = true
    const id = site._id || site.id
    if (id) {
      await api.post(`/website/${id}/delete`)
    }
    websites.value = websites.value.filter(s => s !== site)
  } catch (e) {
    console.error(e)
    alert(e?.response?.data?.message || e?.message || 'Failed to delete')
  } finally {
    site.__saving = false
  }
}

onMounted(() => {
  fetchWebsites()
})
</script>

<style scoped>
</style>
