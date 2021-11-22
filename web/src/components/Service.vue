<template>
	<div class="service">
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
</template>

<script setup lang="ts">
import { IService } from '../models/kerdienst-gemist'
import { formatDate, formatTime } from '../util/datetime-helpers'

defineProps<{ service: IService }>()
</script>
