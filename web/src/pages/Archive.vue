<template>
	<p v-if="loading">Loading...</p>
	<div class="section" v-else>
		<h1 class="title">Archief</h1>
		<div v-for="service in services" class="service">
			<div>
				<h4 class="is-size-4">{{ service.title }}</h4>
				<p>
					{{ formatDate(service.createdAt.toDate()) }} -
					{{ formatTime(service.createdAt.toDate()) }}
				</p>
			</div>
			<a class="button">
				<span class="icon">
					<i class="fas fa-download"></i>
				</span>
				<span>Download link maken</span>
			</a>
		</div>
	</div>
</template>

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

// const getSignedUrl = (service: IService) => {
// 	const file =
// }

onMounted(async () => {
	const collectionRef = collection(
		firestore,
		'services'
	) as CollectionReference<IService>
	const servicesQuery = query<IService>(
		collectionRef,
		orderBy('createdAt', 'desc'),
		limit(9)
	)

	subscribeAll<IService>(servicesQuery, data => {
		console.log(data)
		services.value = data
		loading.value = false
	})
})
</script>

<style lang="scss">
.service {
	margin-bottom: 2rem;
	display: flex;
	justify-content: space-between;
}
</style>
