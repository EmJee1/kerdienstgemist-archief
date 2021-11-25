<template>
	<Modal @close="$emit('close')">
		<template v-slot:header>
			<p class="moda-card-title">Gegenereerde URL</p>
			<button
				class="delete"
				aria-label="close"
				@click="$emit('close')"
			></button>
		</template>
		<template v-slot:body>
			<Notification :type="ColorType.Warning">
				<template v-slot:header>Belangrijke informatie</template>
				<template v-slot:body>
					Met deze link is de dienst te beluisteren door iedereen die hiervan in
					bezit is. Deze toegang geld voor 7 dagen.
				</template>
			</Notification>
			<Notification v-if="error" :type="ColorType.Danger">
				<template v-slot:header>Fout bij het genereren</template>
				<template v-slot:body>
					Bij het genereren van de url is er iets fout gegaan, probeer het
					zometeen opnieuw. Neem contact op met
					<a href="mailto:mart-janroeleveld@outlook.com">
						mart-janroeleveld@outlook.com
					</a>
					als dit blijft gebeuren
				</template>
			</Notification>
			<Loader v-if="loading" />
			<div v-else class="copy-url" @click="copyUrl">
				<input disabled type="text" class="input" :value="url" ref="inputRef" />
				<button
					class="button is-info"
					:class="{
						'is-info': copyStatus === undefined,
						'is-danger': copyStatus === false,
						'is-success': copyStatus,
					}"
				>
					<span class="icon">
						<i class="fas fa-copy"></i>
					</span>
				</button>
			</div>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Modal from './Modal.vue'
import Loader from './Loader.vue'
import Notification from './Notification.vue'
import { IService } from '../models/kerdienst-gemist'
import { ColorType } from '../models/styling'

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ service: IService }>()

const inputRef = ref<HTMLInputElement>()
const copyStatus = ref<boolean>()
const url = ref('')
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
	try {
		const { data } = await axios.get(
			`/createSignedServiceDownloadUrl?servicePath=${props.service.file}`
		)

		url.value = data.url
	} catch (err) {
		error.value = true
		console.error(err)
	} finally {
		loading.value = false
	}
})

const copyUrl = () => {
	if (!inputRef.value) return

	copyStatus.value = undefined

	// disabled selects are not selectable, by toggling disabled the select method works as expected
	inputRef.value.disabled = false
	inputRef.value.select()
	inputRef.value.disabled = true

	navigator.clipboard
		.writeText(url.value)
		.then(() => (copyStatus.value = true))
		.catch(err => {
			copyStatus.value = false
			console.error(err)
		})
		.finally(() => setTimeout(() => (copyStatus.value = undefined), 2000))
}
</script>

<style lang="scss">
.copy-url {
	display: flex;

	.input[type='text'] {
		cursor: pointer;
	}
}
</style>
