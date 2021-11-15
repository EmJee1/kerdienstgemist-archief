<script setup lang="ts">
import '@fortawesome/fontawesome-free/js/all.js'
import 'bulma/css/bulma.css'
import { ref } from 'vue'
import { auth } from './firebase/firebase'
import Login from './pages/Login.vue'

const isLoggedIn = ref(false)

auth.onAuthStateChanged(user => (isLoggedIn.value = user ? true : false))
</script>

<template>
	<router-view v-if="isLoggedIn" />
	<Login v-else />
</template>

<style>
* {
	font-family: 'Inter', sans-serif;
}
</style>
