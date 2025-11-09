<!-- <script>
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
-->

<script>
	import Chart from 'chart.js/auto';

	function changeData() {
		dataToGraph = [14, 15, 13, 25, 21, 7, 15, 2, 30, 19, 20, 19, 21, 29];
	}

	let dataToGraph = [12, 19, 3, 5, 2, 3, 10, 20, 3, 9, 200, 9, 1, 2];
	let chartObject;

	function chart(node, data) {
		function setupChart(_data) {
			chartObject = new Chart(node, {
				type: 'bar',
				data: {
					labels: [
						'Red',
						'Blue',
						'Yellow',
						'Green',
						'Purple',
						'Orange',
						'Purple2',
						'Val2',
						'Graph2',
						'Dap'
					],
					datasets: [
						{
							label: '# of Votes',
							data: _data,
							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
		setupChart(data);
		return {
			update(data) {
				chartObject.destroy();
				setupChart(data);
			},
			destroy() {
				chartObject.destroy();
			}
		};
	}
</script>

<button on:click={changeData}>Change data</button>
<div>
	<canvas class="chart" use:chart={dataToGraph} />
</div>