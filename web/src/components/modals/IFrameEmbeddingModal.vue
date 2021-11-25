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
			<InputCopy :text="iFrameCode" />
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
					Type de naam van dit iFrame ({{ iFrame.name }}) om te verwijderen
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
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import InputCopy from '../InputCopy.vue'
import Notification from '../Notification.vue'
import { IIFrameEmbed } from '../../models/embedding'
import { ColorType } from '../../models/styling'

defineEmits<{ (e: 'close'): void }>()
const props = defineProps<{ iFrame: IIFrameEmbed }>()

const iFrameName = ref('')

const iFrameCode = computed(
	() =>
		`https://kerdienstgemist-archief.web.app/iframe-embed?apiKey=${props.iFrame.apiKey}`
)

const onDeleteSubmit = (e: Event) => {
	if (props.iFrame.name !== iFrameName.value) return
}
</script>
