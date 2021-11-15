<script setup lang="ts">
import { ref } from 'vue'
import { fetchKerdienstgemistFeed } from '../services/kerdienst-gemist'
import { IService } from '../models/kerdienst-gemist'
import { formatDate, formatTime } from '../util/datetime-helpers'

const services = ref<IService[]>([])

fetchKerdienstgemistFeed()
	.then((items: any) => (services.value = items))
	.catch(err => console.error('Error while requesting feed:', err))
</script>

<template>
	<div class="section">
		<h1 class="title">Kerdienstgemist archief</h1>
		<div v-for="service in services">
			<h4 class="is-size-4">{{ service.title }}</h4>
			<p>
				{{ formatDate(new Date(service.pubDate)) }} -
				{{ formatTime(new Date(service.pubDate)) }}
			</p>
			<a class="button" :href="service.enclosure.url">
				<span class="icon">
					<i class="fas fa-download"></i>
				</span>
				<span>Download</span>
			</a>
		</div>
	</div>
</template>
