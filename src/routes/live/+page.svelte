<main id="live" class="container mx-auto flex-1 py-12">
	<h2 class="mb-10 text-center text-3xl font-semibold">Live Monitoring Dashboard</h2>

	<div class="grid gap-8 md:grid-cols-2">
		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">Water Temp(°C)</h3>
			<canvas id="chartWaterTemp"></canvas>
		</div>

		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">Air Pressure (atmospheres)</h3>
			<canvas id="chartAirPressure"></canvas>
		</div>

		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">Humidity (g/m³)</h3>
			<canvas id="chartHumidity"></canvas>
		</div>

		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">
				Total Dissolved Particles (Parts Per Million)
			</h3>
			<canvas id="chartTotalDissolvedParticles"></canvas>
		</div>
	</div>
</main>
