<script>
	import Chart from 'chart.js/auto';

	export let data;
	const { nodeData } = data;

	console.log(nodeData);

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

	let prompt = '';
	let response = '';
	let loading = false;

	async function sendPrompt() {
		if (!prompt) return;
		loading = true;
		response = '';

		try {
			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});
			const data = await res.json();
			response = data.reply || data.error || 'No response.';
		} catch (err) {
			console.error(err);
			response = 'Error contacting the AI.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-lg p-4">
	<h2 class="mb-2 text-xl font-semibold">Ask Gemini</h2>
	<input
		bind:value={prompt}
		placeholder="Enter your prompt..."
		class="mb-3 w-full rounded border p-2"
	/>
	<button on:click={sendPrompt} class="rounded bg-blue-600 px-4 py-2 text-white" disabled={loading}>
		{loading ? 'Thinking...' : 'Send'}
	</button>

	{#if response}
		<div class="mt-4 rounded border bg-gray-50 p-3 whitespace-pre-wrap">
			{response}
		</div>
	{/if}
</div>

<button on:click={changeData}>Change data</button>
<div>
	<canvas class="chart" use:chart={dataToGraph} />
</div>
