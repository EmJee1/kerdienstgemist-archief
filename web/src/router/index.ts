import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import KerdienstGemist from '../pages/Archive.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/archive',
	},
	{
		path: '/archive',
		component: KerdienstGemist,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
