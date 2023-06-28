import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//pinia
import { createPinia } from 'pinia' 
const pinia = createPinia()

//routes
import router from "./routes/index";

const app = createApp(App)

//routes 
app.use(router)
//pinia
app.use(pinia)

app.mount('#app')