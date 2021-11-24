<template>
	<Modal @close="$emit('close')">
		<template v-slot:header>
			<p class="moda-card-title">IFrame embed</p>
			<button
				class="delete"
				aria-label="close"
				@click="$emit('close')"
			></button>
		</template>
		<template v-slot:body>
			<div class="copy-url">
				<input
					disabled
					type="text"
					class="input"
					:value="iFrameCode"
					ref="inputRef"
				/>
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
import { ref, computed } from 'vue'
import Modal from './Modal.vue'
import { IIFrameEmbed } from '../models/embedding'

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ iFrame: IIFrameEmbed }>()

const copyStatus = ref<boolean>()

const iFrameCode = computed(
	() =>
		`https://kerdienstgemist-archief.web.app/iframe-embed?apiKey=${props.iFrame.apiKey}`
)
</script>
