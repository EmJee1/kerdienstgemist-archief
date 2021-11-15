<script setup lang="ts">
import { auth } from '../firebase/firebase'

const signout = () => auth.signOut()
</script>

<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start">
				<a class="navbar-item"> Home </a>
				<a class="navbar-item"> Documentation </a>
			</div>

			<div class="navbar-end">
				<div class="navbar-item">
					<div class="buttons">
						<a class="button is-light" @click="signout"> Uitloggen </a>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<style lang="scss">
.navbar-menu {
	display: block;

	@media only screen and (min-width: 1024px) {
		display: flex;
	}
}
</style>
