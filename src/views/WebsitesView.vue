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
            <tr v-if="!loading && websites.length === 0">
              <td colspan="4" class="px-6 py-6 text-center text-gray-500">No websites yet. Click "Add website" to create one.</td>
            </tr>
            <tr v-for="(site, idx) in websites" :key="site._id || site.id || site.site_name + idx">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ idx + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ site.site_name || site.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
                    (site.site_status || site.status) === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                  {{ (site.site_status || site.status) || 'unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center gap-2">
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
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/http.js'

const websites = ref([])
const loading = ref(false)
const error = ref('')

const showAdd = ref(false)
const newSiteName = ref('')
const validationError = ref('')
const addError = ref('')
const saving = ref(false)

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

    console.log(data)
    // Optimistically add to list; if API returns the created site use it, else construct one
    const created = data && (data.site_name || data)
    websites.value.unshift(created? created : { name: newSiteName.value, site_status: 'active' })
    closeAdd()
  } catch (e) {
    addError.value = e?.response?.data?.message || e?.message || 'Could not add website'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(site) {
  try {
    site.__saving = true
    const current = site.site_status || site.status
    const next = current === 'active' ? 'inactive' : 'active'
    const id = site._id || site.id
    if (id) {
      await api.post(`/website/${id}`, { site_status: next })
    }
    if ('site_status' in site) site.site_status = next
    else site.status = next
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
