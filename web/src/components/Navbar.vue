<script setup lang="ts">
import { auth } from '../firebase/firebase'

const signout = () => auth.signOut()
</script>

<template>
	<nav role="navigation" aria-label="main navigation">
		<div class="section py-4">
			<div id="navbarBasicExample" class="nav-menu">
				<div class="navbar-start">
					<router-link to="/" class="navbar-item"> Home </router-link>
				</div>

				<div class="navbar-end">
					<div class="navbar-item">
						<div class="buttons">
							<a class="button is-light" @click="signout"> Uitloggen </a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<style lang="scss">
.nav-menu {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
