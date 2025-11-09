<script>
	import '../app.css';
	import favicon from '$lib/assets/tfaLogo.png';

	// import Header from './Header.svelte';
	// import Footer from './Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- <Header /> -->

{@render children()}

<!-- <div id="chatbot" class="fixed right-6 bottom-6">
	<button
		class="bg-primary-500 hover:bg-primary-600 rounded-full px-4 py-3 font-bold text-white shadow-lg"
	>
		💬 Chat with TerraBot
	</button>
</div> -->

<!-- <Footer /> -->
