<template>
	<article class="message" :class="{ [type]: true }" v-if="show">
		<div class="message-header">
			<strong>
				<slot name="header" />
			</strong>
			<button
				class="delete"
				aria-label="delete"
				@click="show = false"
				v-if="!noClose"
			></button>
		</div>
		<div class="message-body">
			<slot name="body" />
		</div>
	</article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ type: NotificationType; noClose?: boolean }>()

const show = ref(true)
</script>

<script lang="ts">
export enum NotificationType {
	Dark = 'is-dark',
	Primary = 'is-primary',
	Link = 'is-link',
	Info = 'is-info',
	Success = 'is-success',
	Warning = 'is-warning',
	Danger = 'is-danger',
}
</script>
