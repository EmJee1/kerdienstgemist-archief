import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import KerdienstGemist from '../pages/Archive.vue'
import Embedding from '../pages/Embedding.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/archive',
	},
	{
		path: '/archive',
		component: KerdienstGemist,
	},
	{
		path: '/embedding',
		component: Embedding,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})
