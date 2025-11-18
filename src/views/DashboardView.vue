<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <button
        @click="loadDashboard"
        class="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        :disabled="loading"
      >{{ loading ? 'Refreshing…' : 'Refresh' }}</button>
    </div>

    <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200 text-sm">
      {{ error }}
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div v-for="card in cards" :key="card.key" class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div class="text-xs uppercase tracking-wide text-gray-500">{{ card.title }}</div>
        <div class="mt-2 text-2xl font-semibold text-gray-900">{{ formatNumber(card.value) }}</div>
      </div>
    </div>

    <!-- Pie chart: Active vs Defaced -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Websites status</h2>
        <div class="text-sm text-gray-500">{{ pieSummaryText }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Donut chart -->
        <div class="flex items-center justify-center">
          <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" role="img" aria-label="Active vs Defaced pie chart">
            <g :transform="`rotate(-90 ${center} ${center})`">
              <!-- Track -->
              <circle
                :cx="center" :cy="center" :r="radius"
                class="text-gray-100"
                fill="none" stroke="currentColor" stroke-width="tw"
                :style="{ strokeWidth: stroke }"
              />
              <!-- Defaced slice (red) placed first -->
              <circle
                v-if="totalAD > 0"
                :cx="center" :cy="center" :r="radius"
                fill="none" stroke="#ef4444"
                :stroke-width="stroke"
                :stroke-dasharray="`${defacedArc} ${circumference - defacedArc}`"
                stroke-linecap="butt"
              />
              <!-- Active slice (green) offset after defaced -->
              <circle
                v-if="totalAD > 0"
                :cx="center" :cy="center" :r="radius"
                fill="none" stroke="#22c55e"
                :stroke-width="stroke"
                :stroke-dasharray="`${activeArc} ${circumference - activeArc}`"
                :stroke-dashoffset="defacedArc * -1"
                stroke-linecap="butt"
              />
            </g>
            <!-- Center labels -->
            <g>
              <text :x="center" :y="center - 6" text-anchor="middle" class="fill-gray-900" style="font-size: 18px; font-weight: 600;">
                {{ totalAD }}
              </text>
              <text :x="center" :y="center + 14" text-anchor="middle" class="fill-gray-500" style="font-size: 12px;">
                Total (Active + Defaced)
              </text>
            </g>
          </svg>
        </div>

        <!-- Legend -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-sm" style="background:#22c55e"></span>
              <span class="text-sm text-gray-700">Active websites</span>
            </div>
            <div class="text-sm font-medium text-gray-900">{{ formatNumber(stats.active_websites) }} ({{ activePct }}%)</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-sm" style="background:#ef4444"></span>
              <span class="text-sm text-gray-700">Defaced websites</span>
            </div>
            <div class="text-sm font-medium text-gray-900">{{ formatNumber(stats.defaced_websites) }} ({{ defacedPct }}%)</div>
          </div>
          <div v-if="totalAD === 0" class="text-sm text-gray-500">No active or defaced websites to visualize.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/http.js'

const loading = ref(false)
const error = ref('')
const stats = ref({
  active_websites: 0,
  defaced_websites: 0,
  recent_logs_7d: 0,
  total_keywords: 0,
  total_websites: 0,
})

// Fetch dashboard data
async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/dashboard')
    // Apply defaults to avoid undefined
    stats.value = {
      active_websites: Number(data?.active_websites ?? 0),
      defaced_websites: Number(data?.defaced_websites ?? 0),
      recent_logs_7d: Number(data?.recent_logs_7d ?? 0),
      total_keywords: Number(data?.total_keywords ?? 0),
      total_websites: Number(data?.total_websites ?? 0),
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)

// Cards config
const cards = computed(() => [
  { key: 'total_websites', title: 'Total websites', value: stats.value.total_websites },
  { key: 'active_websites', title: 'Active websites', value: stats.value.active_websites },
  { key: 'defaced_websites', title: 'Defaced websites', value: stats.value.defaced_websites },
  { key: 'recent_logs_7d', title: 'Recent logs (7d)', value: stats.value.recent_logs_7d },
  { key: 'total_keywords', title: 'Total keywords', value: stats.value.total_keywords },
])

function formatNumber(n) {
  try { return new Intl.NumberFormat().format(Number(n || 0)) } catch { return String(n || 0) }
}

// Pie chart math (donut using stroke-dasharray)
const size = 220
const center = size / 2
const stroke = 24
const radius = (size - stroke) / 2
const circumference = 2 * Math.PI * radius

const totalAD = computed(() => stats.value.active_websites + stats.value.defaced_websites)
const activeFraction = computed(() => totalAD.value > 0 ? stats.value.active_websites / totalAD.value : 0)
const defacedFraction = computed(() => totalAD.value > 0 ? stats.value.defaced_websites / totalAD.value : 0)

const activeArc = computed(() => Math.max(0, Math.min(circumference, circumference * activeFraction.value)))
const defacedArc = computed(() => Math.max(0, Math.min(circumference, circumference * defacedFraction.value)))

const activePct = computed(() => totalAD.value === 0 ? 0 : Math.round(activeFraction.value * 100))
const defacedPct = computed(() => totalAD.value === 0 ? 0 : Math.round(defacedFraction.value * 100))

const pieSummaryText = computed(() => `${formatNumber(stats.value.active_websites)} active • ${formatNumber(stats.value.defaced_websites)} defaced`)
</script>

<style scoped>
/* No extra styles needed; Tailwind utilities used */
</style>