<template>
	<div class="section">
		<h1 class="title">Archief</h1>
		<div
			v-for="service in services"
			@click="urlModal = service"
			class="service"
		>
			<div>
				<h4 class="is-size-4">{{ service.title }}</h4>
				<p>
					{{ formatDate(service.createdAt.toDate()) }} -
					{{ formatTime(service.createdAt.toDate()) }}
				</p>
			</div>
			<span class="button is-light">
				<span class="icon">
					<i class="fas fa-share-alt"></i>
				</span>
				<span>Link maken</span>
			</span>
		</div>
		<Loader v-if="loading" />
		<div v-else class="load-more">
			<button
				class="button is-info is-rounded"
				@click="loadNextDataChunk(services.length)"
			>
				Laad meer
			</button>
		</div>
	</div>
	<GeneratedUrlModal
		v-if="urlModal"
		:service="urlModal"
		@close="urlModal = undefined"
	/>
</template>

<script setup lang="ts">
import {
	collection,
	CollectionReference,
	limit,
	query,
	getDocs,
	startAfter,
	orderBy,
	startAt,
} from '@firebase/firestore'
import { ref, onMounted } from 'vue'
import Loader from '../components/Loader.vue'
import GeneratedUrlModal from '../components/GeneratedUrlModal.vue'
import { firestore } from '../firebase/firebase'
import { IService } from '../models/kerdienst-gemist'
import { formatDate, formatTime } from '../util/datetime-helpers'

const loading = ref(true)
const services = ref<IService[]>([])
const urlModal = ref<IService>()

onMounted(async () => loadNextDataChunk(0))

const loadNextDataChunk = async (startAtIndex: number) => {
	loading.value = true

	const collectionRef = collection(
		firestore,
		'services'
	) as CollectionReference<IService>

	const servicesQuery = startAtIndex
		? query<IService>(
				collectionRef,
				orderBy('createdAt', 'desc'),
				startAfter(services.value[services.value.length - 1].createdAt),
				limit(9)
		  )
		: query<IService>(collectionRef, orderBy('createdAt', 'desc'), limit(9))

	try {
		const querySnapshot = await getDocs(servicesQuery)
		querySnapshot.forEach(doc =>
			services.value.push({ ...doc.data(), id: doc.id })
		)
	} catch (err) {
		alert('Er is iets fout gegaan met het ophalen van de data')
		console.error(err)
	} finally {
		loading.value = false
	}
}
</script>

<style lang="scss" scoped>
.service {
	margin-bottom: 2rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-radius: 8px;
	border: 1px solid #b2bec3;
	cursor: pointer;
}

.load-more {
	display: flex;
	justify-content: center;
}
</style>
