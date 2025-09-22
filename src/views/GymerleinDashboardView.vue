<template>
  <div class="min-h-screen">
    <!-- Main Layout Container -->
    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside class="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-sidebar-border">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-sm">G</span>
            </div>
            <span class="font-bold text-lg text-sidebar-foreground">Gymerlein</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li>
              <button
                  @click="activeMenu = 'dashboard'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'dashboard' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                </svg>
                Dashboard
              </button>
            </li>

            <!-- Clients Section -->
            <li>
              <button
                  @click="toggleClientsMenu"
                  class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Clients
                </div>
                <svg
                    :class="['w-4 h-4 transition-transform', clientsMenuOpen ? 'rotate-180' : '']"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Clients Submenu -->
              <ul v-show="clientsMenuOpen" class="ml-8 mt-2 space-y-1">
                <li>
                  <button
                      @click="activeMenu = 'leads'"
                      :class="[
                      'w-full text-left px-3 py-1 rounded text-sm transition-colors',
                      activeMenu === 'leads' ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground hover:text-sidebar-primary'
                    ]"
                  >
                    Leads
                  </button>
                </li>
                <li>
                  <button
                      @click="activeMenu = 'plans'"
                      :class="[
                      'w-full text-left px-3 py-1 rounded text-sm transition-colors',
                      activeMenu === 'plans' ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground hover:text-sidebar-primary'
                    ]"
                  >
                    Plans To Assign
                  </button>
                </li>
                <li>
                  <button
                      @click="activeMenu = 'active-clients'"
                      :class="[
                      'w-full text-left px-3 py-1 rounded text-sm transition-colors',
                      activeMenu === 'active-clients' ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground hover:text-sidebar-primary'
                    ]"
                  >
                    Active Clients
                  </button>
                </li>
                <li>
                  <button
                      @click="activeMenu = 'inactive-clients'"
                      :class="[
                      'w-full text-left px-3 py-1 rounded text-sm transition-colors bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    ]"
                  >
                    Inactive Clients
                  </button>
                </li>
              </ul>
            </li>

            <!-- Other Menu Items -->
            <li>
              <button
                  @click="activeMenu = 'fitness'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'fitness' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Fitness
              </button>
            </li>

            <li>
              <button
                  @click="activeMenu = 'nutrition'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'nutrition' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                Nutrition
              </button>
            </li>

            <li>
              <button
                  @click="activeMenu = 'coaching'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'coaching' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Coaching
              </button>
            </li>

            <li>
              <button
                  @click="activeMenu = 'bookings'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'bookings' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Bookings
              </button>
            </li>

            <li>
              <button
                  @click="activeMenu = 'messages'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'messages' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Messages
              </button>
            </li>

            <li>
              <button
                  @click="activeMenu = 'subscriptions'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'subscriptions' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Subscriptions
              </button>
            </li>
          </ul>
        </nav>

        <!-- Subscription Status -->
        <div class="p-4 border-t border-sidebar-border">
          <div class="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-center">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div class="text-white font-bold text-lg">22/30 days</div>
            <div class="text-white/80 text-xs mb-3">Subscribe to<br>Unlock all features</div>
            <button class="bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Unlock Features
            </button>
          </div>
        </div>

        <!-- Bottom Menu -->
        <div class="p-4 border-t border-sidebar-border">
          <ul class="space-y-2">
            <li>
              <button
                  @click="activeMenu = 'settings'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'settings' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Settings
              </button>
            </li>
            <li>
              <button
                  @click="activeMenu = 'help'"
                  :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeMenu === 'help' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Help
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Header -->
        <header class="bg-card border-b border-border p-4">
          <div class="flex items-center justify-between">
            <!-- Search Bar -->
            <div class="flex-1 max-w-md">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search anything"
                    class="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd class="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border">⌘ F</kbd>
                </div>
              </div>
            </div>

            <!-- User Profile -->
            <div class="flex items-center gap-4">
              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                </svg>
              </button>
              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              <div class="flex items-center gap-3">
<!--                <img-->
<!--                    src="/placeholder.svg?height=32&width=32"-->
<!--                    alt="Tahsan Khan"-->
<!--                    class="w-8 h-8 rounded-full"-->
<!--                >-->
                <div class="text-sm">
                  <div class="font-medium text-foreground">Tahsan Khan</div>
                  <div class="text-muted-foreground">Designer</div>
                </div>
                <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-auto p-6">
          <!-- Page Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-foreground">Inactive Clients</h1>
              <p class="text-muted-foreground">Manage your customer base, view groups, your teams and access all the details of each customer.</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                Manage group
              </button>
              <button class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add client
              </button>
            </div>
          </div>

          <!-- Filters and Search -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search..."
                    class="pl-10 pr-4 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
              </div>

              <select class="px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>State</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <select class="px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Group</option>
                <option>Gym</option>
                <option>Workout</option>
                <option>Exercises</option>
              </select>

              <select class="px-4 py-2 border border-input rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Created date</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <button class="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Filter
              </button>
              <button class="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export
              </button>
              <button class="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                Import
              </button>
            </div>
          </div>

          <!-- Clients Table -->
          <div class="bg-card rounded-lg border border-border overflow-hidden">
            <table class="w-full">
              <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="text-left p-4 font-medium text-muted-foreground">
                  <input type="checkbox" class="rounded border-border">
                </th>
                <th class="text-left p-4 font-medium text-muted-foreground">Client name</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Groups</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Goal</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Trend last days</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th class="text-left p-4 font-medium text-muted-foreground">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="client in filteredClients" :key="client.id" class="border-b border-border hover:bg-muted/30 transition-colors">
                <td class="p-4">
                  <input type="checkbox" class="rounded border-border">
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
<!--                    <img-->
<!--                        :src="client.avatar"-->
<!--                        :alt="client.name"-->
<!--                        class="w-10 h-10 rounded-full"-->
<!--                    >-->
                    <div>
                      <div class="font-medium text-foreground">{{ client.name }}</div>
                      <div class="text-sm text-muted-foreground">{{ client.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-foreground">{{ client.date }}</td>
                <td class="p-4">
                  <button class="flex items-center gap-1 text-sm text-accent hover:text-accent/80">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Add
                  </button>
                  <div class="text-xs text-muted-foreground mt-1">Description</div>
                </td>
                <td class="p-4 text-foreground">{{ client.goal }}</td>
                <td class="p-4 text-foreground">{{ client.trendDays }}</td>
                <td class="p-4">
                    <span
                        :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ client.status }}
                    </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button class="p-1 hover:bg-muted rounded transition-colors">
                      <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                    <button class="p-1 hover:bg-muted rounded transition-colors">
                      <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                    </button>
                    <button class="p-1 hover:bg-muted rounded transition-colors">
                      <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between mt-6">
            <div class="text-sm text-muted-foreground">
              Showing 1 to 8 of 50 entries
            </div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button class="px-3 py-2 bg-primary text-primary-foreground rounded-lg">1</button>
              <button class="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">2</button>
              <button class="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">3</button>
              <span class="px-3 py-2 text-muted-foreground">...</span>
              <button class="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">10</button>
              <button class="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div class="text-sm text-muted-foreground">
              Show 8
              <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeMenu = ref('inactive-clients')
const clientsMenuOpen = ref(true)
const searchQuery = ref('')

const toggleClientsMenu = () => {
  clientsMenuOpen.value = !clientsMenuOpen.value
}

const clients = ref([
  {
    id: 1,
    name: 'Tahsan Khan',
    email: 'tahsankhan@gmail.com',
    // 
    date: '06 Jan, 2025',
    goal: 'Gym',
    trendDays: 12,
    status: 'Inactive'
  },
  {
    id: 2,
    name: 'Harry kane',
    email: 'harrykane@gmail.com',
    // 
    date: '07 Jan, 2025',
    goal: 'Workout',
    trendDays: 24,
    status: 'Inactive'
  },
  {
    id: 3,
    name: 'Anwar Hussein',
    email: 'anwarhussein@gmail.com',
    
    date: '08 Jan, 2025',
    goal: 'Exercises',
    trendDays: 20,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Tim David',
    email: 'timdavid@gmail.com',
    
    date: '09 Jan, 2025',
    goal: 'Workout',
    trendDays: 18,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'David Warner',
    email: 'davidwarner@gmail.com',
    
    date: '10 Jan, 2025',
    goal: 'Exercises',
    trendDays: 15,
    status: 'Inactive'
  },
  {
    id: 6,
    name: 'Harry Brooks',
    email: 'harrybrooks@gmail.com',
    
    date: '11 Jan, 2025',
    goal: 'Gym',
    trendDays: 11,
    status: 'Inactive'
  },
  {
    id: 7,
    name: 'Matt Henry',
    email: 'matthenry@gmail.com',
    
    date: '12 Jan, 2025',
    goal: 'Exercises',
    trendDays: 8,
    status: 'Inactive'
  },
  {
    id: 8,
    name: 'Nill Wagner',
    email: 'nillwagner@gmail.com',
    
    date: '13 Jan, 2025',
    goal: 'Workout',
    trendDays: 17,
    status: 'Inactive'
  },
  {
    id: 9,
    name: 'Hasan Khan',
    email: 'hasankhan@gmail.com',
    
    date: '14 Jan, 2025',
    goal: 'Exercises',
    trendDays: 21,
    status: 'Inactive'
  },
  {
    id: 10,
    name: 'Will Jack',
    email: 'willjack@gmail.com',
    
    date: '15 Jan, 2025',
    goal: 'Gym',
    trendDays: 14,
    status: 'Inactive'
  }
])

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value

  return clients.value.filter(client =>
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.goal.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>