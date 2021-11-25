<template>
	<table class="table is-hoverable" style="width: 100%">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Aangemaakt op</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="iFrame in dummyData" @click="selectedIFrame = iFrame">
				<td>{{ iFrame.name }}</td>
				<td>{{ formatDate(new Date()) }}</td>
			</tr>
		</tbody>
	</table>
	<Button
		icon="fas fa-plus"
		:color-type="ColorType.Primary"
		@click="showCreateIFrame = true"
	>
		Aanmaken
	</Button>
	<IFrameEmbeddingModal
		v-if="selectedIFrame"
		:i-frame="selectedIFrame"
		@close="selectedIFrame = undefined"
	/>
	<CreateIFrameModal
		v-if="showCreateIFrame"
		@close="showCreateIFrame = false"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { IIFrameEmbed } from '../models/embedding'
import { ColorType } from '../models/styling'
import { formatDate } from '../util/datetime-helpers'
import IFrameEmbeddingModal from './IFrameEmbeddingModal.vue'
import Button from './Button.vue'
import CreateIFrameModal from './CreateIFrameModal.vue'

const dummyData: IIFrameEmbed[] = [
	{
		id: 'AABBCC',
		name: 'Kerkwebsite',
		apiKey: uuid(),
	},
	{
		id: 'DDEEFF',
		name: 'Andere externe bron',
		apiKey: uuid(),
	},
]

const showCreateIFrame = ref(false)
const selectedIFrame = ref<IIFrameEmbed>()
</script>

<style scoped lang="scss">
tbody tr {
	cursor: pointer;
}
</style>
