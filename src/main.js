import DatePicker from '@/DatePicker'
import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App).mount('#app')

app.component('DatePicker', DatePicker);