import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue')
  },
  {
    path: '/keywords',
    name: 'keywords',
    component: () => import('../views/KeywordsView.vue')
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import('../views/LogsView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/change/password',
    name: 'changePassword',
    component: () => import('../views/ChangePasswordView.vue')
  },
  {
    path: '/websites',
    name: 'websites',
    component: () => import('../views/WebsitesView.vue')
  }
]

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
    linkActiveClass: 'is-active',            // partial match
    linkExactActiveClass: 'is-exact-active',
    scrollBehavior() {
    return { top: 0 }
  }
})

export default router
