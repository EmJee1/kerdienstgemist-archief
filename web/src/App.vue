<script setup lang="ts">
import '@fortawesome/fontawesome-free/js/all.js'
import 'bulma/css/bulma.css'
import './util/axios'
import { ref } from 'vue'
import { auth } from './firebase/firebase'
import FullPageLoader from './components/FullPageLoader.vue'
import Navbar from './components/Navbar.vue'
import Login from './pages/Login.vue'

const isLoggedIn = ref<boolean>()

auth.onAuthStateChanged(user => (isLoggedIn.value = user ? true : false))
</script>

<template>
	<FullPageLoader v-if="isLoggedIn === undefined" />
	<Login v-else-if="!isLoggedIn" />
	<div v-else>
		<Navbar />
		<div class="section">
			<div class="container">
				<router-view />
			</div>
		</div>
	</div>
</template>

<style>
* {
	font-family: 'Inter', sans-serif;
}
</style>
