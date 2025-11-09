<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  // --- Fake Live Data Example ---
  let liveData = [
    { waterTemp: 21, humidity: 68, tds: 850 },
    { waterTemp: 23, humidity: 55, tds: 920 },
    { waterTemp: 22, humidity: 60, tds: 880 }
  ];

  let recommendations = [];

  // --- Recommendation Logic ---
  function generateRecommendations() {
    const latest = liveData[liveData.length - 1];
    recommendations = [];

    if (latest.waterTemp > 22) {
      recommendations.push("⚠️ Water temperature is high. Consider cooling nutrient solution.");
    } else if (latest.waterTemp < 20) {
      recommendations.push("🌡️ Water temperature is low. Consider increasing ambient warmth.");
    }

    if (latest.humidity < 60) {
      recommendations.push("💧 Humidity is low. Increase misting or reduce fan speed.");
    }

    if (latest.tds > 900) {
      recommendations.push("🧪 Nutrient concentration slightly high. Dilute with fresh water.");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ All systems optimal — great work!");
    }
  }

  // --- Chatbot Logic ---
  let chatOpen = false;
  let chatInput = "";
  let messages = [
    { role: "bot", text: "Hi! I'm TerraBot 🌿. Ask me about your hydroponic setup!" }
  ];

  async function sendMessage() {
    if (!chatInput.trim()) return;

    messages = [...messages, { role: "user", text: chatInput }];
    const userMessage = chatInput;
    chatInput = "";

    // Simulated AI delay and reply
    await new Promise((r) => setTimeout(r, 800));
    let reply = "";

    if (userMessage.toLowerCase().includes("water")) {
      reply = "Water levels look good — keep monitoring temperature between 20–22°C.";
    } else if (userMessage.toLowerCase().includes("humidity")) {
      reply = "Humidity around 60% is ideal for most leafy greens 🌱.";
    } else {
      reply = "I'm still learning! Try asking about water, humidity, or nutrients.";
    }

    messages = [...messages, { role: "bot", text: reply }];
  }

  // --- Charts ---
  onMount(() => {
    generateRecommendations();

    // Water Temperature Chart
    new Chart(document.getElementById('chartWaterTemp'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'Water Temp (°C)', data: [21, 22, 23, 22, 21] },
        ],
      },
    });

    // Air Pressure Chart
    new Chart(document.getElementById('chartAirPressure'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'Air Pressure (atm)', data: [1.02, 1.01, 1.03, 1.00, 1.01] },
        ],
      },
    });

    // Humidity Chart
    new Chart(document.getElementById('chartHumidity'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'Humidity (%)', data: [68, 64, 61, 58, 60] },
        ],
      },
    });

    // TDS Chart
    new Chart(document.getElementById('chartTDS'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'TDS (ppm)', data: [850, 880, 900, 910, 880] },
        ],
      },
    });
  });
</script>

<!-- Page Layout -->
<div class="bg-surface-100 text-surface-900 min-h-screen flex flex-col font-sans">
  <!-- Header -->
  <header class="bg-primary-500 text-primary-contrast-500 p-6 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <img src="/tfaLogo.png" alt="TerraFlo Logo" class="h-10 w-10 rounded-full shadow-md" />
        <h1 class="text-2xl font-bold">TerraFlo Analytics</h1>
      </div>
      <nav class="space-x-4 text-lg">
        <a href="#about" class="hover:underline">About</a>
        <a href="#live" class="hover:underline">Live</a>
        <a href="#historical" class="hover:underline">Historical</a>
        <a href="#contact" class="hover:underline">Contact</a>
      </nav>
    </div>
  </header>

  <!-- About Section -->
  <section id="about" class="bg-surface-50 py-20 text-center">
    <div class="container mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-primary-700">
        Affordable Intelligence for Sustainable Growth
      </h2>
      <p class="max-w-2xl mx-auto text-lg leading-relaxed">
        TerraFlo Analytics helps hydroponic and traditional farmers gain real-time insights into their operations — 
        from nutrient balance to light optimization — without the heavy costs of big data systems.
      </p>
    </div>
  </section>

  <!-- Live Dashboard -->
  <main id="live" class="container mx-auto py-12 flex-1">
    <h2 class="text-3xl font-semibold text-center mb-10">Live Monitoring Dashboard</h2>

    <!-- 2x2 Grid of Charts -->
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
        <h3 class="text-xl font-semibold mb-4 text-primary-700">Water Temp (°C)</h3>
        <canvas id="chartWaterTemp"></canvas>
      </div>

      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
        <h3 class="text-xl font-semibold mb-4 text-primary-700">Air Pressure (atm)</h3>
        <canvas id="chartAirPressure"></canvas>
      </div>

      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
        <h3 class="text-xl font-semibold mb-4 text-primary-700">Humidity (%)</h3>
        <canvas id="chartHumidity"></canvas>
      </div>

      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
        <h3 class="text-xl font-semibold mb-4 text-primary-700">TDS (ppm)</h3>
        <canvas id="chartTDS"></canvas>
      </div>
    </div>
  </main>

  <!-- Smart Recommendations -->
  <section id="recommendations" class="bg-surface-100 py-16">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-primary-700 mb-6">Smart Recommendations</h2>
      <div class="bg-surface-200 text-lg p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-2">
        {#each recommendations as rec}
          <p>{rec}</p>
        {/each}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-secondary-500 text-secondary-contrast-500 text-center p-6 mt-auto">
    © 2025 TerraFlo Analytics — Empowering Smart Farming Affordably
  </footer>

  <!-- Floating Chatbot -->
  <div class="fixed bottom-6 right-6">
    <button
      class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-full shadow-lg"
      on:click={() => (chatOpen = !chatOpen)}>
      💬 {chatOpen ? 'Close TerraBot' : 'Chat with TerraBot'}
    </button>

    {#if chatOpen}
      <div class="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl w-80 max-h-[400px] flex flex-col">
        <div class="p-3 bg-primary-500 text-white rounded-t-xl font-semibold">
          TerraBot 🌿
        </div>
        <div class="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
          {#each messages as m}
            <div class={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span
                class={`inline-block px-3 py-2 rounded-lg ${
                  m.role === 'user' ? 'bg-primary-100' : 'bg-secondary-100'
                }`}>
                {m.text}
              </span>
            </div>
          {/each}
        </div>
        <div class="p-2 border-t flex space-x-2">
          <input
            class="flex-1 border rounded-lg px-3 py-2 text-sm"
            bind:value={chatInput}
            placeholder="Ask me anything..."
            on:keydown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            class="bg-primary-500 hover:bg-primary-600 text-white px-3 rounded-lg"
            on:click={sendMessage}>
            Send
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<svelte:head>
  <script src="/chat.js"></script>
</svelte:head>

<style>
  @import "https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton/themes/hamlindigo.css";
  @import "https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css";
</style>
