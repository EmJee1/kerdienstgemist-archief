<template>
	<Modal @close="$emit('close')">
		<template v-slot:header>
			<p class="moda-card-title">iFrame embed</p>
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
			<hr />
			<Notification :type="ColorType.Warning" v-if="iFrameName">
				<template v-slot:header>Belangrijke informatie</template>
				<template v-slot:body>
					Als u dit verwijderd zullen alle plekken die dit specifieke iFrame
					gebruiken niet meer functioneren omdat de rechten hiervan verwijderd
					zullen worden. Controleer goed of deze niet meer nodig zijn voordat u
					kiest voor verwijderen.
				</template>
			</Notification>
			<form @submit.prevent="onDeleteSubmit">
				<label for="iframe-name" class="label">
					Type de naam van dit iFrame om te verwijderen ({{ iFrame.name }})
				</label>
				<input class="input" id="iframe-name" v-model="iFrameName" />
				<Button
					class="mt-2"
					icon="fas fa-trash"
					:color-type="ColorType.Danger"
					:disabled="iFrameName !== iFrame.name"
				>
					Verwijderen
				</Button>
			</form>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from './Modal.vue'
import Notification from './Notification.vue'
import { IIFrameEmbed } from '../models/embedding'
import { ColorType } from '../models/styling'
import Button from './Button.vue'

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ iFrame: IIFrameEmbed }>()

const copyStatus = ref<boolean>()
const iFrameName = ref('')

const iFrameCode = computed(
	() =>
		`https://kerdienstgemist-archief.web.app/iframe-embed?apiKey=${props.iFrame.apiKey}`
)

const onDeleteSubmit = (e: Event) => {
	console.log('deleting...')
}
</script>
