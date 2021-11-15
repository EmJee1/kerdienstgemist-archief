<script setup lang="ts">
import {
	collection,
	CollectionReference,
	limit,
	orderBy,
	query,
} from '@firebase/firestore'
import { ref, onMounted } from 'vue'
import { firestore } from '../firebase/firebase'
import { subscribeAll } from '../firebase/firebase-helpers'
import { IService } from '../models/kerdienst-gemist'
import { formatDate, formatTime } from '../util/datetime-helpers'

const loading = ref(true)
const services = ref<IService[]>([])

onMounted(async () => {
	const collectionRef = collection(
		firestore,
		'services'
	) as CollectionReference<IService>
	const servicesQuery = query<IService>(
		collectionRef,
		orderBy('createdAt'),
		limit(9)
	)

	subscribeAll<IService>(servicesQuery, data => {
		console.log('Recieved new data:', data)
		services.value = data
		loading.value = false
	})
})
</script>

<template>
	<p v-if="loading">Loading...</p>
	<div class="section" v-else>
		<h1 class="title">Archief</h1>
		<div v-for="service in services">
			<h4 class="is-size-4">{{ service.title }}</h4>
			<p>
				{{ formatDate(service.createdAt.toDate()) }} -
				{{ formatTime(service.createdAt.toDate()) }}
			</p>
			<a class="button">
				<span class="icon">
					<i class="fas fa-download"></i>
				</span>
				<span>Create download link</span>
			</a>
		</div>
	</div>
</template>
