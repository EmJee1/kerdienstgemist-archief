import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import KerdienstGemist from '../pages/kerdienstGemist.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/kerdienst-gemist',
	},
	{
		path: '/kerdienst-gemist',
		component: KerdienstGemist,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
