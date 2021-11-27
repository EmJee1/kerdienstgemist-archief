<template>
	<h1 class="title">iFrame Embedding</h1>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
	// check if has valid apiKey
	const apiKey = route.query.apiKey
	console.log(apiKey)
	// fetch results
})
</script>
