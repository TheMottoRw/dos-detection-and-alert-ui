<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard 👋</h1>
<!--      <div class="flex items-center gap-4 flex-wrap">-->
<!--        &lt;!&ndash; Date filters &ndash;&gt;-->
<!--        <input v-model="startDate" type="date" class="px-3 py-2 border border-gray-200 rounded-lg"/>-->
<!--        <input v-model="endDate" type="date" class="px-3 py-2 border border-gray-200 rounded-lg"/>-->
<!--        &lt;!&ndash; Category filter &ndash;&gt;-->
<!--        <select v-model="selectedCategory" class="px-3 py-2 border border-gray-200 rounded-lg min-w-[180px]">-->
<!--          <option value="">All categories</option>-->
<!--          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>-->
<!--        </select>-->
<!--        <button @click="applyFilters" class="px-4 py-2 bg-primary text-white rounded-lg">Apply</button>-->
<!--      </div>-->
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- New Courses -->
        <div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="course in newCourses" :key="course.id" class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div class="flex items-center gap-3 mb-3">
                <div :class="course.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center">
                  <span class="text-lg">{{ course.icon }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ course.title }}</h3>
                  <p class="text-sm text-gray-500">{{ course.count }} Keywords</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hours Activity -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Keywords Activity</h2>
            <select v-model="period" @change="applyFilters" class="text-sm border border-gray-200 rounded-lg px-3 py-1">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div v-if="errorMsg" class="text-sm text-red-600 mb-2">{{ errorMsg }}</div>
          <div class="flex items-end justify-start h-40 gap-1 flex-wrap">
            <div v-for="(b, index) in categoryBars" :key="index" class="flex flex-col items-center gap-1">
              <div class="flex-1 flex items-end">
                <div
                    :style="{ height: b.heightPx + 'px' }"
                    class="w-9 rounded-t-lg min-h-[8px] bg-yellow-400"
                    :title="`${b.label}: ${b.value}`"
                ></div>
              </div>
              <span class="text-[10px] text-gray-600 truncate w-full" :title="b.label">{{ b.label }}</span>
            </div>
            <div v-if="!categoryBars.length" class="text-sm text-gray-500">No category data available.</div>
          </div>
        </div>

      </div>

      <!-- Right Column -->
      <div class="space-y-6">

        <!-- Daily Schedule -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Top categories</h2>
          <div class="space-y-3">
            <div v-for="(item, idx) in topCategories" :key="item.classification_category || idx" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-700 font-semibold">
                {{ (item.classification_category || '?').slice(0,1).toUpperCase() }}
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ item.classification_category }}</h4>
                <p class="text-sm text-gray-500">{{ item.count }} keywords</p>
              </div>
            </div>
            <div v-if="!topCategories.length" class="text-sm text-gray-500">No categories found for selected filters.</div>
          </div>
        </div>

     </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../services/http.js'

// Filters
const startDate = ref('')
const endDate = ref('')
const selectedCategory = ref('')
const categories = ref([])
const loading = ref(false)
const errorMsg = ref('')

// Summary cards
const summary = ref({ total_classification: 0, true_classification: 0, misclassification: 0 })

// Top categories list
const topCategories = ref([])

// Time series data
const period = ref('daily') // 'daily' | 'weekly' | 'monthly'
const series = ref([]) // [{ label, value }]

// Bar data for top categories chart
const categoryBars = computed(() => {
  const items = Array.isArray(topCategories.value) ? topCategories.value : []
  const mapped = items.map(it => ({
    label: it.classification_category || it.category || 'Unknown',
    value: Number(it.count ?? 0)
  }))
  const max = Math.max(0, ...mapped.map(m => m.value)) || 1
  const maxPx = 140 // drawable height in px inside h-40 container (~160px)
  return mapped.map(m => ({
    ...m,
    valuePct: Math.round((m.value / max) * 100),
    heightPx: Math.max(8, Math.round((m.value / max) * maxPx))
  }))
})

// Derived: cards for UI
const newCourses = computed(() => [
  { id: 1, title: 'Total keywords', count: summary.value.total_classification || 0, rating: 0, type: '', icon: '✏️', iconBg: 'bg-orange-100' },
  { id: 2, title: 'True classification', count: summary.value.true_classification || 0, rating: 0, type: '', icon: '🔍', iconBg: 'bg-green-100' },
  { id: 3, title: 'Misclassification', count: summary.value.misclassification || 0, rating: 0, type: '', icon: '📷', iconBg: 'bg-blue-100' }
])

const weeklyActivity = ref([
  { label: 'Su', height: 20, isToday: false },
  { label: 'Mo', height: 40, isToday: false },
  { label: 'Tu', height: 60, isToday: false },
  { label: 'We', height: 30, isToday: false },
  { label: 'Th', height: 80, isToday: true },
  { label: 'Fr', height: 45, isToday: false },
  { label: 'Sa', height: 25, isToday: false }
])

const activeCourses = ref([
  {
    id: 1,
    title: '3D Design Course',
    instructor: 'Michael Andrew',
    status: 'Remaining',
    timeRemaining: '6h 45 min',
    progress: 45,
    icon: '🎨',
    iconBg: 'bg-purple-100'
  },
  {
    id: 2,
    title: 'Development Basics',
    instructor: 'Natalia Verman',
    status: 'Remaining',
    timeRemaining: '15h 12 min',
    progress: 75,
    icon: '💻',
    iconBg: 'bg-red-100'
  }
])

const dailySchedule = ref([
  {
    id: 1,
    title: 'Design System',
    subtitle: 'Lecture • Class',
    icon: '🎨',
    iconBg: 'bg-orange-100'
  },
  {
    id: 2,
    title: 'Typography',
    subtitle: 'Group • Test',
    icon: '📝',
    iconBg: 'bg-blue-100'
  },
  {
    id: 3,
    title: 'Color Style',
    subtitle: 'Group • Test',
    icon: '🎨',
    iconBg: 'bg-yellow-100'
  },
  {
    id: 4,
    title: 'Visual Design',
    subtitle: 'Lecture • Test',
    icon: '👁️',
    iconBg: 'bg-green-100'
  }
])

async function fetchSummary(params) {
  try {
    const { data } = await api.get('/dashboard/user', { params })
    summary.value.total_classification = data?.total_classification ?? 0
    summary.value.misclassification = data?.misclassification ?? 0
    summary.value.true_classification = data?.true_classification ?? 0
    // If summary includes top categories, set them too
    if (Array.isArray(data?.top_categories)) {
      topCategories.value = data.top_categories
    }
  } catch (e) {
    // Non-fatal; show message
    errorMsg.value = e?.response?.data?.message || 'Failed to load summary'
  }
}

async function fetchTopCategories(params) {
  try {
    const { data } = await api.get('/dashboard/top-categories', { params })
    topCategories.value = Array.isArray(data) ? data : (data?.items || [])
    // Populate categories list for filter if empty
    if (!categories.value.length) {
      categories.value = topCategories.value.map(t => t.classification_category || t.category).filter(Boolean)
    }
  } catch (e) {
    // if endpoint not exist, ignore; categories may still come from summary
  }
}

async function fetchSeries(params) {
  try {
    const { data } = await api.get('/dashboard/series', { params: { ...params, period: period.value } })
    const points = Array.isArray(data) ? data : (data?.points || [])
    series.value = points.map(p => ({ label: p.label ?? p.date ?? '', value: Number(p.value ?? p.count ?? 0) }))
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || 'Failed to load activity'
    series.value = []
  }
}

function buildParams() {
  return {
    start_date: startDate.value || undefined,
    end_date: endDate.value || undefined,
    category: selectedCategory.value || undefined,
  }
}

async function applyFilters() {
  loading.value = true
  errorMsg.value = ''
  const params = buildParams()
  await Promise.all([
    fetchSummary(params),
    // fetchTopCategories(params),
    // fetchSeries(params),
  ])
  loading.value = false
}

onMounted(() => {
  applyFilters()
})

const assignments = ref([
  {
    id: 1,
    title: 'Methods of data',
    dueDate: '02 Aug, 10:30 AM',
    status: 'In progress',
    icon: '📊',
    iconBg: 'bg-purple-100'
  },
  {
    id: 2,
    title: 'Market Research',
    dueDate: '14 June, 10:45 AM',
    status: 'Completed',
    icon: '📈',
    iconBg: 'bg-green-100'
  },
  {
    id: 3,
    title: 'Data Collection',
    dueDate: '12 May, 11:00 AM',
    status: 'Upcoming',
    icon: '📋',
    iconBg: 'bg-orange-100'
  }
])

const currentMonth = ref('August, 2023')

// Generate calendar dates
const calendarDates = ref([
  ...Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    isCurrentMonth: true,
    isToday: i + 1 === 17
  }))
])
</script>