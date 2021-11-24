<template>
	<div class="tabs" :class="{ 'is-centered': center }">
		<ul>
			<slot />
		</ul>
	</div>
</template>

<script setup lang="ts">
defineProps<{ center?: boolean }>()
</script>
