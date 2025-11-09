<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data;
	const { nodeData } = data;

	function prepareChartData(nodeData, metricKey, labelLimit = 30) {
		const filtered = nodeData
			.filter((d) => d.metricType === metricKey)
			.map((d) => ({
				time: new Date(d.timeStamp),
				value: parseFloat(d.value)
			}))
			.sort((a, b) => a.time - b.time);

		if (filtered.length === 0) return { labels: [], values: [] };

		// Downsample to avoid clutter
		const step = Math.ceil(filtered.length / labelLimit);
		const reduced = filtered.filter((_, i) => i % step === 0);

		const labels = reduced.map((d) =>
			d.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
		const values = reduced.map((d) => d.value);

		return { labels, values };
	}

	const chartData = {
		water_temp: prepareChartData(nodeData, 'water_temp'),
		air_temp: prepareChartData(nodeData, 'air_temp'),
		humidity: prepareChartData(nodeData, 'humidity'),
		pressure: prepareChartData(nodeData, 'pressure'),
		tds: prepareChartData(nodeData, 'tds'),
		water_level: prepareChartData(nodeData, 'water_level')
	};

	let userInput = '';
	let response = '';
	let responses = [
		{ role: 'bot', text: "Hi! I'm TerraBot 🌿. Ask me about your hydroponic setup!" }
	];
	let loading = false;

	async function sendPrompt() {
		if (!userInput) return;
		loading = true;
		response = '';

		responses = [...responses, { role: 'user', text: userInput }];

		let prompt = userInput;
		userInput = '';

		try {
			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt })
			});
			const data = await res.json();
			response = data.reply || data.error || 'No response.';
			responses = [...responses, { role: 'bot', text: response }];
		} catch (err) {
			console.error(err);
			response = 'Error contacting the AI.';
		} finally {
			loading = false;
		}
	}

	// --- Live Sensor Data (Example / Simulated) ---
	let liveData = [
		{ waterTemp: 22.3, airTemp: 24.1, airPressure: 1.01, humidity: 63, tds: 890 },
		{ waterTemp: 22.5, airTemp: 24.0, airPressure: 1.02, humidity: 61, tds: 905 },
		{ waterTemp: 22.8, airTemp: 25.0, airPressure: 1.0, humidity: 60, tds: 915 }
	];

	// --- State variables ---
	let recommendations = [];
	let chatOpen = false;
	let chatInput = '';
	let messages = [
		{ role: 'bot', text: "Hi! I'm TerraBot 🌿. Ask me about your hydroponic setup!" }
	];

	// --- Smart Recommendations based on real hydroponic data ---
	function generateRecommendations() {
		const latest = liveData[liveData.length - 1];
		recommendations = [];

		// Water Temperature
		if (latest.waterTemp > 26) {
			recommendations.push(
				'⚠️ Water temperature is too high (risk of root rot). Cool your nutrient reservoir.'
			);
		} else if (latest.waterTemp > 24) {
			recommendations.push('🌡️ Water temperature slightly high. Ideal range is 18–24 °C.');
		} else if (latest.waterTemp < 18) {
			recommendations.push(
				'❄️ Water too cold — roots slow nutrient uptake. Add a heater or insulate the tank.'
			);
		}

		// Air Temperature
		if (latest.airTemp > 28) {
			recommendations.push('🔥 Air temperature high. Increase ventilation or shade plants.');
		} else if (latest.airTemp < 20) {
			recommendations.push('🌬️ Air temperature low. Add warmth to maintain 20–26 °C range.');
		}

		// Humidity
		if (latest.humidity < 55) {
			recommendations.push('💧 Humidity is too low — increase misting or lower fan speed.');
		} else if (latest.humidity > 70) {
			recommendations.push('💨 Humidity high — increase airflow to prevent mold.');
		}

		// TDS
		if (latest.tds > 1200) {
			recommendations.push('🧪 TDS high — dilute nutrient solution with fresh water.');
		} else if (latest.tds < 800) {
			recommendations.push('🌿 TDS low — add nutrients to reach 800–1200 ppm.');
		}

		// Air Pressure
		if (latest.airPressure < 0.98) {
			recommendations.push(
				'⛅ Air pressure slightly low — possible weather change, monitor system response.'
			);
		}

		if (recommendations.length === 0) {
			recommendations.push('✅ All systems optimal — your hydroponic setup is balanced!');
		}
	}

	// --- Chatbot Logic ---
	async function sendMessage() {
		if (!chatInput.trim()) return;
		messages = [...messages, { role: 'user', text: chatInput }];
		const userMessage = chatInput;
		chatInput = '';

		await new Promise((r) => setTimeout(r, 800));
		let reply = '';

		if (userMessage.toLowerCase().includes('water')) {
			reply = '💧 Water temps look ideal between 18–24 °C for root health.';
		} else if (userMessage.toLowerCase().includes('humidity')) {
			reply = 'Humidity around 60–70 % is optimal for most leafy greens 🌱.';
		} else if (userMessage.toLowerCase().includes('tds')) {
			reply = 'Target TDS is 800–1200 ppm depending on crop type.';
		} else if (userMessage.toLowerCase().includes('temperature')) {
			reply = 'Air temp should stay between 20–26 °C — stable growth zone.';
		} else {
			reply = "I'm still learning! Try asking about water, humidity, temperature, or nutrients.";
		}

		messages = [...messages, { role: 'bot', text: reply }];
	}

	// --- Scroll Fade Animation ---
	function handleScroll() {
		const elements = document.querySelectorAll('.fade-on-scroll');
		const triggerBottom = window.innerHeight * 0.9;

		elements.forEach((el) => {
			const boxTop = el.getBoundingClientRect().top;
			if (boxTop < triggerBottom) el.classList.add('show');
			else el.classList.remove('show');
		});
	}

	// --- Chart Setup ---
	onMount(() => {
		generateRecommendations();
		window.addEventListener('scroll', handleScroll);
		handleScroll();

		function makeChart(id, label, data, color, yOpts) {
			new Chart(document.getElementById(id), {
				type: 'line',
				data: {
					labels: data.labels,
					datasets: [
						{
							label,
							data: data.values,
							borderColor: color,
							fill: false,
							tension: 0.3
						}
					]
				},
				options: {
					scales: {
						y: yOpts,
						x: { ticks: { maxTicksLimit: 10 } }
					}
				}
			});
		}

		// --- Live Dashboard Charts ---
		// Water Temperature (°C)
		makeChart('chartWaterTemp', 'Water Temp (°C)', chartData.water_temp, '#4CAF50', {
			suggestedMin: 15,
			suggestedMax: 30,
			ticks: { stepSize: 2 }
		});

		// Air Temperature (°C)
		makeChart('chartAirTemp', 'Air Temp (°C)', chartData.air_temp, '#2196F3', {
			suggestedMin: 15,
			suggestedMax: 35,
			ticks: { stepSize: 2 }
		});

		// Humidity (%)
		makeChart('chartHumidity', 'Humidity (%)', chartData.humidity, '#FF9800', {
			suggestedMin: 30,
			suggestedMax: 90,
			ticks: { stepSize: 10 }
		});

		// Pressure (hPa)
		makeChart('chartAirPressure', 'Pressure (atm)', chartData.pressure, '#9C27B0', {
			suggestedMin: 995,
			suggestedMax: 1030,
			ticks: { stepSize: 5 }
		});

		// TDS (ppm)
		makeChart('chartTDS', 'TDS (ppm)', chartData.tds, '#E91E63', {
			suggestedMin: 0,
			suggestedMax: 1000,
			ticks: { stepSize: 100 }
		});

		new Chart(document.getElementById('chartWaterLevel'), {
			type: 'bar',
			data: {
				labels: chartData.water_level.labels,
				datasets: [
					{
						label: 'Water Level',
						data: chartData.water_level.values.map((v) =>
							v < 3 ? 0 : v < 4 ? 1 : v < 5 ? 2 : 3
						),
						backgroundColor: '#795548'
					}
				]
			},
			options: {
				scales: {
					y: {
						ticks: {
							stepSize: 1,
							callback: (value) => ['Fill Water', 'Low', 'Medium', 'High'][value] || value
						},
						suggestedMin: 0,
						suggestedMax: 3
					},
					x: { ticks: { maxTicksLimit: 10 } }
				}
			}
		});

		// --- Historical Section Charts (Added) ---
		new Chart(document.getElementById('chartHistoricalTemp'), {
			type: 'line',
			data: {
				labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
				datasets: [
					{
						label: 'Avg Water Temp (°C)',
						data: [19.8, 21.2, 23.1, 24.6, 22.9, 20.4],
						borderColor: '#4CAF50',
						backgroundColor: 'rgba(76,175,80,0.2)',
						fill: true,
						tension: 0.4
					}
				]
			},
			options: {
				plugins: { legend: { display: true } },
				scales: {
					y: {
						suggestedMin: 18,
						suggestedMax: 26,
						title: { display: true, text: '°C' }
					}
				}
			}
		});

		new Chart(document.getElementById('chartHistoricalTDS'), {
			type: 'line',
			data: {
				labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
				datasets: [
					{
						label: 'Avg TDS (ppm)',
						data: [820, 870, 930, 1100, 960, 880],
						borderColor: '#9C27B0',
						backgroundColor: 'rgba(156,39,176,0.2)',
						fill: true,
						tension: 0.4
					}
				]
			},
			options: {
				plugins: { legend: { display: true } },
				scales: {
					y: {
						suggestedMin: 700,
						suggestedMax: 1200,
						title: { display: true, text: 'ppm' }
					}
				}
			}
		});
	});

	// --- Smooth Scroll to Footer ---
	function scrollToFooter() {
		document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Layout -->
<div class="flex min-h-screen flex-col bg-surface-100 font-sans text-surface-900">
	<header class="fade-on-scroll bg-primary-500 p-6 text-primary-contrast-500 shadow-md">
		<div class="container mx-auto flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<img src="/tfaLogo.png" alt="TerraFlo Logo" class="h-10 w-10 rounded-full shadow-md" />
				<h1 class="text-2xl font-bold">TerraFlo Analytics</h1>
			</div>
			<nav class="space-x-4 text-lg">
				<a href="#about" class="hover:underline">About</a>
				<a href="#live" class="hover:underline">Live</a>
				<a href="#historical" class="hover:underline">Historical</a>
				<button on:click={scrollToFooter} class="hover:underline">Contact</button>
			</nav>
		</div>
	</header>

	<section id="about" class="fade-on-scroll bg-surface-50 py-20 text-center">
		<h2 class="mb-4 text-4xl font-bold text-primary-700">
			Affordable Intelligence for Sustainable Growth
		</h2>
		<p class="mx-auto max-w-2xl text-lg leading-relaxed">
			TerraFlo Analytics gives hydroponic and soil-based farmers real-time insights — from nutrient
			stability to climate balance — all through accessible, low-cost data visualization.
		</p>
	</section>

	<main id="live" class="fade-on-scroll container mx-auto flex-1 py-12">
		<h2 class="mb-10 text-center text-3xl font-semibold">Live Monitoring Dashboard</h2>
		<div class="grid gap-8 md:grid-cols-2">
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">Water Temp (°C)</h3>
				<canvas id="chartWaterTemp"></canvas>
			</div>
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">Air Temp (°C)</h3>
				<canvas id="chartAirTemp"></canvas>
			</div>
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">Air Pressure (atm)</h3>
				<canvas id="chartAirPressure"></canvas>
			</div>
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">Humidity (%)</h3>
				<canvas id="chartHumidity"></canvas>
			</div>
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">TDS (ppm)</h3>
				<canvas id="chartTDS"></canvas>
			</div>
			<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-primary-700">Water Level</h3>
				<canvas id="chartWaterLevel"></canvas>
			</div>
		</div>
	</main>

	<section id="recommendations" class="fade-on-scroll bg-surface-100 py-16">
		<div class="container mx-auto text-center">
			<h2 class="mb-6 text-3xl font-semibold text-primary-700">Smart Recommendations</h2>
			<div class="mx-auto max-w-3xl space-y-2 rounded-xl bg-surface-200 p-6 text-lg shadow-lg">
				{#each recommendations as rec}
					<p>{rec}</p>
				{/each}
			</div>
		</div>
	</section>

	<section id="historical" class="fade-on-scroll bg-surface-50 py-16">
		<div class="container mx-auto text-center">
			<h2 class="mb-10 text-3xl font-semibold text-primary-700">
				Historical Data (6-Month Trends)
			</h2>
			<div class="grid gap-8 md:grid-cols-2">
				<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
					<h3 class="mb-4 text-xl font-semibold text-primary-700">Average Water Temp (°C)</h3>
					<canvas id="chartHistoricalTemp"></canvas>
				</div>
				<div class="h-96 rounded-xl bg-surface-200 p-6 shadow-lg">
					<h3 class="mb-4 text-xl font-semibold text-primary-700">Average TDS (ppm)</h3>
					<canvas id="chartHistoricalTDS"></canvas>
				</div>
			</div>
		</div>
	</section>

	<footer
		class="fade-on-scroll mt-auto bg-secondary-500 p-6 text-center text-secondary-contrast-500"
	>
		<div class="flex flex-col items-center space-y-3">
			<img
				src="/tfaLogo.png"
				alt="TerraFlo Logo"
				class="h-14 w-14 rounded-full border-2 border-white shadow-md"
			/>
			<p>© 2025 TerraFlo Analytics — Empowering Smart Farming Affordably</p>
		</div>
	</footer>

	<!-- Chatbot -->
	<div class="fixed right-6 bottom-6">
		<button
			class="rounded-full bg-primary-500 px-4 py-3 font-bold text-white shadow-lg hover:bg-primary-600"
			on:click={() => (chatOpen = !chatOpen)}
		>
			💬 {chatOpen ? 'Close TerraBot' : 'Chat with TerraBot'}
		</button>

		{#if chatOpen}
			<div
				class="absolute right-0 bottom-16 flex max-h-[400px] w-80 flex-col rounded-xl bg-white shadow-2xl"
			>
				<div class="rounded-t-xl bg-primary-500 p-3 font-semibold text-white">TerraBot 🌿</div>
				<div class="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
					{#each responses as m}
						<div class={m.role === 'user' ? 'text-right' : 'text-left'}>
							<span
								class={`inline-block rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-primary-100' : 'bg-secondary-100'}`}
							>
								{m.text}
							</span>
						</div>
					{/each}
				</div>
				<div class="flex space-x-2 border-t p-2">
					<input
						class="flex-1 rounded-lg border px-3 py-2 text-sm"
						bind:value={userInput}
						placeholder="Ask me anything..."
						on:keydown={(e) => e.key === 'Enter' && sendPrompt()}
					/>
					<button
						class="rounded-lg bg-primary-500 px-3 text-white hover:bg-primary-600"
						on:click={sendPrompt()}
					>
						Send
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@import 'https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton/themes/hamlindigo.css';
	@import 'https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css';

	:global(html)::after {
		content: '';
	}

	.fade-on-scroll {
		opacity: 0;
		transform: translateY(40px);
		transition: all 0.8s ease-out;
	}

	.fade-on-scroll.show {
		opacity: 1;
		transform: translateY(0);
	}
</style>
