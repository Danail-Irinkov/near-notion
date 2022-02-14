import 'virtual:windi.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Buffer } from 'buffer'

if (window) {
	// @ts-ignore
	window.Buffer = Buffer
}

const openLinkNewTab = (URL = null) => {
	if (URL)
		window.open(URL, '_blank')
}


const app = createApp(App)
app.use(createPinia())
	.use(router)
	.use(VueAxios, axios)
	.provide('openLinkNewTab', openLinkNewTab)
	.mount('#app')
