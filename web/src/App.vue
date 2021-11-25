<script setup lang="ts">
import '@fortawesome/fontawesome-free/js/all.js'
import 'bulma/css/bulma.css'
import './util/axios'
import { ref } from 'vue'
import { auth } from './firebase/firebase'
import FullPageLoader from './components/FullPageLoader.vue'
import Navbar from './components/Navbar.vue'
import Login from './pages/Login.vue'
import useDevice from './composables/use-device'
import ClientOffline from './pages/ClientOffline.vue'

const isLoggedIn = ref<boolean>()
const { isOnline } = useDevice(true)

auth.onAuthStateChanged(user => (isLoggedIn.value = user ? true : false))
</script>

<template>
	<ClientOffline v-if="!isOnline" />
	<FullPageLoader v-else-if="isLoggedIn === undefined" />
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
