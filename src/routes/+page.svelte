<script>
	export let data;
	const { nodes } = data;
</script>

<h2>Nodes</h2>
{#if nodes.length > 0}
	<ul>
		{#each nodes as node}
			<li>{node.id}</li>
			<li>{node.name}</li>
			<li>{node.location}</li>
			<li>{node.is_online}</li>
			<li>{node.last_ping}</li>
		{/each}
	</ul>
{:else}
	<p>No nodes found.</p>
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
