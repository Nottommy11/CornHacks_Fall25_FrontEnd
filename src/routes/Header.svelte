<script>
	import favicon from '$lib/assets/tfaLogo.png';
</script>

<header class="bg-primary-500 p-6 text-primary-contrast-500 shadow-md">
	<div class="container mx-auto flex items-center justify-between">
		<img src={favicon} alt="TerraFlo Analytics Logo" class="top-left-image" />
		<h1 class="text-2xl font-bold">TerraFlo Analytics</h1>
		<nav class="space-x-4 text-lg">
			<a href="#live" class="hover:underline">Live</a>
			<a href="about" class="hover:underline">About</a>
		</nav>
	</div>
</header>

<style>
	.top-left-image {
		width: 80px;
		height: auto;
	}
</style>
