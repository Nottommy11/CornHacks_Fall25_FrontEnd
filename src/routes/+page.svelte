<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	// --- USERS ---
	let users = [];
	let username = '';
	let password = '';
	let loginError = '';
	let isRegister = false;
	let loggedIn = false;

	// --- Load users ---
	onMount(async () => {
		const res = await fetch('/users.json');
		users = await res.json();
	});

	// --- Login/Register ---
	function login() {
		const user = users.find((u) => u.username === username && u.password === password);
		if (user) {
			loggedIn = true;
			loginError = '';
			setTimeout(initDashboard, 0);
		} else {
			loginError = '❌ Invalid username or password.';
		}
	}

	function register() {
		if (!username || !password) {
			loginError = '❌ Enter username and password.';
			return;
		}
		if (users.find((u) => u.username === username)) {
			loginError = '❌ Username exists.';
			return;
		}
		users.push({ username, password });
		loginError = '✅ Account created! Please log in.';
		isRegister = false;
		username = '';
		password = '';
	}

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

	// --- Live sensor data ---
	let liveData = [
		{ waterTemp: 22.3, airTemp: 24.1, airPressure: 1.01, humidity: 63, tds: 890 },
		{ waterTemp: 22.5, airTemp: 24.0, airPressure: 1.02, humidity: 61, tds: 905 },
		{ waterTemp: 22.8, airTemp: 25.0, airPressure: 1.0, humidity: 60, tds: 915 }
	];

	let recommendations = [];
	let chatOpen = false;
	let chatInput = '';
	let messages = [
		{ role: 'bot', text: "Hi! I'm TerraBot 🌿. Ask me about your hydroponic setup!" }
	];

	// --- SMART, DATA-BASED RECOMMENDATIONS ---
	function generateRecommendations() {
		const latest = liveData[liveData.length - 1];
		recommendations = [];

		// Reference values (general hydroponic leafy greens)
		const IDEAL_WATER_TEMP = [18, 24]; // °C
		const IDEAL_AIR_TEMP = [20, 26]; // °C
		const IDEAL_HUMIDITY = [55, 70]; // %
		const IDEAL_TDS = [800, 1200]; // ppm
		const IDEAL_AIR_PRESSURE = [0.98, 1.05]; // atm typical stable range

		// --- WATER TEMPERATURE ---
		if (latest.waterTemp > 26)
			recommendations.push(
				'⚠️ Water temperature is too high (>26 °C). Roots may suffer from oxygen deprivation and nutrient uptake issues. Consider using a water chiller or insulating the reservoir.'
			);
		else if (latest.waterTemp > IDEAL_WATER_TEMP[1])
			recommendations.push(
				'🌡️ Water temperature slightly high (24–26 °C). Optimal growth occurs between 18–24 °C — slightly cooler water keeps roots oxygenated.'
			);
		else if (latest.waterTemp < IDEAL_WATER_TEMP[0])
			recommendations.push(
				'❄️ Water too cold (<18 °C). Root metabolism slows and nutrient absorption drops. Use a submersible heater or insulate pipes.'
			);

		// --- AIR TEMPERATURE ---
		if (latest.airTemp > 28)
			recommendations.push(
				'🔥 Air temperature high (>28 °C). Heat stress may stunt growth or cause tip burn in lettuce. Increase ventilation or use reflective shading.'
			);
		else if (latest.airTemp < 18)
			recommendations.push(
				'🥶 Air temperature below optimal (<18 °C). Growth slows; consider mild heating or enclosing the grow area to retain warmth.'
			);
		else if (latest.airTemp > IDEAL_AIR_TEMP[1])
			recommendations.push(
				'⚠️ Air temperature slightly high (26–28 °C). Maintain between 20–26 °C for steady transpiration and nutrient movement.'
			);

		// --- HUMIDITY ---
		if (latest.humidity < IDEAL_HUMIDITY[0])
			recommendations.push(
				'💧 Humidity low (<55 %). Plants may transpire too quickly, leading to nutrient imbalance. Increase misting, or slow fan speed.'
			);
		else if (latest.humidity > IDEAL_HUMIDITY[1])
			recommendations.push(
				'💨 Humidity high (>70 %). Mold, mildew, or calcium deficiency can occur. Improve airflow or reduce mist cycles.'
			);

		// --- TDS / NUTRIENT STRENGTH ---
		if (latest.tds > 1500)
			recommendations.push(
				'🧪 TDS too high (>1500 ppm). Nutrient burn risk! Dilute with fresh water to bring levels down to ~1000 ppm.'
			);
		else if (latest.tds > IDEAL_TDS[1])
			recommendations.push(
				'⚠️ TDS slightly above ideal (1200–1500 ppm). Ideal range for leafy greens is 800–1200 ppm. Add water if tips show burn.'
			);
		else if (latest.tds < 600)
			recommendations.push(
				'🌿 TDS too low (<600 ppm). Plants may be nutrient-deficient — add nutrient concentrate to reach 800–1200 ppm.'
			);
		else if (latest.tds < IDEAL_TDS[0])
			recommendations.push(
				'🧩 TDS slightly below ideal (600–800 ppm). Consider mild nutrient addition for stronger vegetative growth.'
			);

		// --- AIR PRESSURE ---
		if (latest.airPressure < IDEAL_AIR_PRESSURE[0])
			recommendations.push(
				'🌫️ Air pressure slightly low (<0.98 atm). Weather shifts or storms may alter humidity and evaporation — monitor stability.'
			);
		else if (latest.airPressure > IDEAL_AIR_PRESSURE[1])
			recommendations.push(
				'☀️ Air pressure higher than normal (>1.05 atm). Usually stable conditions, but minor stress possible if rapid changes occur.'
			);

		// --- MULTI-CONDITION INSIGHTS ---
		if (latest.airTemp > 26 && latest.humidity > 70)
			recommendations.push(
				'⚠️ High heat + high humidity detected. This combo promotes fungal growth. Increase ventilation immediately.'
			);
		if (latest.airTemp < 20 && latest.humidity < 55)
			recommendations.push(
				'🌬️ Cool and dry air — expect slower photosynthesis. Slightly raise humidity or warmth for balanced VPD (Vapor Pressure Deficit).'
			);
		if (latest.waterTemp > 25 && latest.tds > 1200)
			recommendations.push(
				'🚨 High water temp + high TDS — dangerous combination! Oxygen solubility drops and nutrient burn likely. Dilute and cool water.'
			);

		if (recommendations.length === 0)
			recommendations.push(
				'✅ All systems within optimal hydroponic ranges — excellent environmental balance! Keep monitoring stability for consistent yields.'
			);
	}

	async function sendMessage() {
		if (!chatInput.trim()) return;
		messages = [...messages, { role: 'user', text: chatInput }];
		const userMessage = chatInput;
		chatInput = '';

		await new Promise((r) => setTimeout(r, 800));

		let reply = '';
		if (userMessage.toLowerCase().includes('water'))
			reply = '💧 Water temps look ideal between 18–24 °C for root health.';
		else if (userMessage.toLowerCase().includes('humidity'))
			reply = 'Humidity around 60–70 % is optimal for most leafy greens 🌱.';
		else if (userMessage.toLowerCase().includes('tds'))
			reply = 'Target TDS is 800–1200 ppm depending on crop type.';
		else if (userMessage.toLowerCase().includes('temperature'))
			reply = 'Air temp should stay between 20–26 °C — stable growth zone.';
		else reply = "I'm still learning! Try asking about water, humidity, temperature, or nutrients.";

		messages = [...messages, { role: 'bot', text: reply }];
	}

	function handleScroll() {
		const elements = document.querySelectorAll('.fade-on-scroll');
		const triggerBottom = window.innerHeight * 0.9;

		elements.forEach((el) => {
			const boxTop = el.getBoundingClientRect().top;
			if (boxTop < triggerBottom) el.classList.add('show');
			else el.classList.remove('show');
		});
	}

	function scrollToFooter() {
		document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
	}

	function initDashboard() {
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
						data: chartData.water_level.values.map((v) => (v < 3 ? 0 : v < 4 ? 1 : v < 5 ? 2 : 3)),
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
	}
</script>

{#if !loggedIn}
	<!-- LOGIN / REGISTER -->
	<div class="flex min-h-screen items-center justify-center bg-surface-50">
		<div class="w-96 rounded-xl bg-surface-200 p-12 text-center shadow-xl">
			<h2 class="mb-6 text-2xl font-bold text-primary-700">
				{isRegister ? 'Create Account' : 'Welcome to TerraFlo'}
			</h2>
			<input
				class="mb-4 w-full rounded border border-gray-300 p-3"
				placeholder="Username"
				bind:value={username}
			/>
			<input
				type="password"
				class="mb-4 w-full rounded border border-gray-300 p-3"
				placeholder="Password"
				bind:value={password}
			/>
			{#if loginError}<p class="mb-2 text-red-600">{loginError}</p>{/if}

			{#if isRegister}
				<button
					on:click={register}
					class="mb-2 w-full rounded-lg bg-primary-500 py-3 font-semibold text-white hover:bg-primary-600"
					>Register</button
				>
				<p class="text-sm">
					Already have an account? <button
						class="font-bold text-primary-700"
						on:click={() => {
							isRegister = false;
							loginError = '';
						}}>Login</button
					>
				</p>
			{:else}
				<button
					on:click={login}
					class="mb-2 w-full rounded-lg bg-primary-500 py-3 font-semibold text-white hover:bg-primary-600"
					>Login</button
				>
				<p class="text-sm">
					Don't have an account? <button
						class="font-bold text-primary-700"
						on:click={() => {
							isRegister = true;
							loginError = '';
						}}>Register</button
					>
				</p>
			{/if}
		</div>
	</div>
{:else}
	<!-- DASHBOARD -->
	<div class="flex min-h-screen flex-col bg-surface-100 font-sans text-surface-900">
		<!-- HEADER -->
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

		<!-- ABOUT -->
		<section id="about" class="fade-on-scroll bg-surface-50 py-20 text-center">
			<h2 class="mb-4 text-4xl font-bold text-primary-700">
				Affordable Intelligence for Sustainable Growth
			</h2>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed">
				TerraFlo Analytics gives hydroponic and soil-based farmers real-time insights — from
				nutrient stability to climate balance — all through accessible, low-cost data visualization.
			</p>
		</section>

		<!-- LIVE DASHBOARD -->
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

		<!-- RECOMMENDATIONS -->
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

		<!-- HISTORICAL -->
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

		<!-- FOOTER -->
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

		<!-- CHATBOT -->
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
						{#each responses  as m}
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
							on:click={sendPrompt()}>Send</button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

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
