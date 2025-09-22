import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { useUserStore } from './store/userStore'

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGlobe, faRightFromBracket, faUser,faLock,faUnlock,faPencil,faUserEdit,faCircleCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// Add needed icons to the library
library.add(faGlobe, faRightFromBracket, faUser,faLock,faUnlock,faPencil,faUserEdit,faCircleCheck, faEye, faEyeSlash)

const app = createApp(App)
app.use(router)
// Register the FA component globally
app.component('font-awesome-icon', FontAwesomeIcon)
// Initialize user store with any existing token from localStorage
try {
  const token = localStorage.getItem('token')
  if (token) {
    const userStore = useUserStore()
    userStore.setToken(token)
  }
} catch (_) {}

app.mount('#app')
