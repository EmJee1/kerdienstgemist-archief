<script setup lang="ts">
import '@fortawesome/fontawesome-free/js/all.js'
import 'bulma/css/bulma.css'
import './util/axios'
import { ref } from 'vue'
import { auth } from './firebase/firebase'
import Navbar from './components/Navbar.vue'
import Login from './pages/Login.vue'

const isLoggedIn = ref(false)

auth.onAuthStateChanged(user => (isLoggedIn.value = user ? true : false))
</script>

<template>
	<div v-if="isLoggedIn">
		<Navbar />
		<router-view />
	</div>
	<Login v-else />
</template>

<style>
* {
	font-family: 'Inter', sans-serif;
}
</style>
