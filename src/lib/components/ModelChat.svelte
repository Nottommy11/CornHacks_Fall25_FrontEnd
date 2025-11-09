<script>
	// --- Generate Recommendation Example ---
	const recBox = document.getElementById('recommendation-box');
	const latest = liveData[liveData.length - 1];
	let recommendations = [];

	if (latest.waterTemp > 22) {
		recommendations.push('⚠️ Water temperature is high. Consider cooling nutrient solution.');
	} else if (latest.waterTemp < 20) {
		recommendations.push('🌡️ Water temperature is low. Consider increasing ambient warmth.');
	}

	if (latest.humidity < 60) {
		recommendations.push('💧 Humidity is low. Increase misting or reduce fan speed.');
	}

	if (latest.tds > 900) {
		recommendations.push('🧪 Nutrient concentration slightly high. Dilute with fresh water.');
	}

	if (recommendations.length === 0) {
		recommendations.push('✅ All systems optimal — great work!');
	}

	recBox.innerHTML = recommendations.map((r) => `<p>${r}</p>`).join('');

	const userMessage = prompt('Ask TerraBot a question about your plants:');
	if (!userMessage) return;
	chatButton.disabled = true;
	chatButton.textContent = '💬 Thinking...';

	try {
		const reply = await sendMessage(userMessage);
		alert('TerraBot: ' + reply);
	} catch (err) {
		alert('Error: Could not reach AI.');
		console.error(err);
	}

	chatButton.disabled = false;
	chatButton.textContent = '💬 Chat with TerraBot';
</script>

<section id="recommendations" class="bg-surface-100 py-16">
	<div class="container mx-auto text-center">
		<h2 class="mb-6 text-3xl font-semibold text-primary-700">Smart Recommendations</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg">
			Based on current live readings, TerraFlo suggests the following actions to optimize growth:
		</p>

		<div
			id="recommendation-box"
			class="mx-auto max-w-3xl rounded-xl bg-surface-200 p-6 text-lg shadow-lg"
		>
			Loading recommendations...
		</div>
	</div>
</section>
