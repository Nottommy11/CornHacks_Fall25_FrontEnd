<section id="historical" class="bg-surface-50 py-12">
	<div class="container mx-auto mb-10 text-center">
		<h2 class="text-primary-700 text-3xl font-semibold">Historical Growth & Comparisons</h2>
		<p class="mx-auto max-w-2xl text-lg">
			Review trends over time — compare performance month-to-month and visualize how small
			optimizations improve yield, stability, and cost savings.
		</p>
	</div>

	<div class="container mx-auto grid gap-8 md:grid-cols-2">
		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">Nutrient Levels (6-Month Average)</h3>
			<canvas id="chartHistoricalEC"></canvas>
		</div>
		<div class="bg-surface-200 h-96 rounded-xl p-6 shadow-lg">
			<h3 class="text-primary-700 mb-4 text-xl font-semibold">Yield Growth (%) Over Time</h3>
			<canvas id="chartYield"></canvas>
		</div>
	</div>
</section>
