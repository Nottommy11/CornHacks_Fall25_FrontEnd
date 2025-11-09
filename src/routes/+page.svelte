<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  // --- Live Sensor Data (Example / Simulated) ---
  let liveData = [
    { waterTemp: 22.3, airTemp: 24.1, airPressure: 1.01, humidity: 63, tds: 890 },
    { waterTemp: 22.5, airTemp: 24.0, airPressure: 1.02, humidity: 61, tds: 905 },
    { waterTemp: 22.8, airTemp: 25.0, airPressure: 1.00, humidity: 60, tds: 915 }
  ];

  // --- State variables ---
  let recommendations = [];
  let chatOpen = false;
  let chatInput = ''; // ✅ must be declared as `let` for binding
  let messages = [
    { role: 'bot', text: "Hi! I'm TerraBot 🌿. Ask me about your hydroponic setup!" }
  ];

  // --- Smart Recommendations based on real hydroponic data ---
  function generateRecommendations() {
    const latest = liveData[liveData.length - 1];
    recommendations = [];

    // Water Temperature
    if (latest.waterTemp > 26) {
      recommendations.push("⚠️ Water temperature is too high (risk of root rot). Cool your nutrient reservoir.");
    } else if (latest.waterTemp > 24) {
      recommendations.push("🌡️ Water temperature slightly high. Ideal range is 18–24 °C.");
    } else if (latest.waterTemp < 18) {
      recommendations.push("❄️ Water too cold — roots slow nutrient uptake. Add a heater or insulate the tank.");
    }

    // Air Temperature
    if (latest.airTemp > 28) {
      recommendations.push("🔥 Air temperature high. Increase ventilation or shade plants.");
    } else if (latest.airTemp < 20) {
      recommendations.push("🌬️ Air temperature low. Add warmth to maintain 20–26 °C range.");
    }

    // Humidity
    if (latest.humidity < 55) {
      recommendations.push("💧 Humidity is too low — increase misting or lower fan speed.");
    } else if (latest.humidity > 70) {
      recommendations.push("💨 Humidity high — increase airflow to prevent mold.");
    }

    // TDS
    if (latest.tds > 1200) {
      recommendations.push("🧪 TDS high — dilute nutrient solution with fresh water.");
    } else if (latest.tds < 800) {
      recommendations.push("🌿 TDS low — add nutrients to reach 800–1200 ppm.");
    }

    // Air Pressure
    if (latest.airPressure < 0.98) {
      recommendations.push("⛅ Air pressure slightly low — possible weather change, monitor system response.");
    }

    if (recommendations.length === 0) {
      recommendations.push("✅ All systems optimal — your hydroponic setup is balanced!");
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
      reply = "💧 Water temps look ideal between 18–24 °C for root health.";
    } else if (userMessage.toLowerCase().includes('humidity')) {
      reply = "Humidity around 60–70 % is optimal for most leafy greens 🌱.";
    } else if (userMessage.toLowerCase().includes('tds')) {
      reply = "Target TDS is 800–1200 ppm depending on crop type.";
    } else if (userMessage.toLowerCase().includes('temperature')) {
      reply = "Air temp should stay between 20–26 °C — stable growth zone.";
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

    // Water Temp Chart
    new Chart(document.getElementById('chartWaterTemp'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Water Temp (°C)', data: [21, 22, 22.5, 22.2, 21.8], borderColor: '#4CAF50' }]
      },
    });

    // Air Pressure Chart
    new Chart(document.getElementById('chartAirPressure'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Air Pressure (atm)', data: [1.02, 1.01, 1.03, 1.00, 1.01], backgroundColor: '#90CAF9' }]
      },
    });

    // Humidity Chart
    new Chart(document.getElementById('chartHumidity'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Humidity (%)', data: [67, 65, 63, 62, 64], borderColor: '#FF9800' }]
      },
    });

    // TDS Chart
    new Chart(document.getElementById('chartTDS'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'TDS (ppm)', data: [850, 870, 880, 890, 865], borderColor: '#9C27B0' }]
      },
    });
  });

  // --- Smooth Scroll to Footer ---
  function scrollToFooter() {
    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<!-- Layout -->
<div class="bg-surface-100 text-surface-900 min-h-screen flex flex-col font-sans">
  <header class="bg-primary-500 text-primary-contrast-500 p-6 shadow-md fade-on-scroll">
    <div class="container mx-auto flex justify-between items-center">
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

  <section id="about" class="bg-surface-50 py-20 text-center fade-on-scroll">
    <h2 class="text-4xl font-bold mb-4 text-primary-700">
      Affordable Intelligence for Sustainable Growth
    </h2>
    <p class="max-w-2xl mx-auto text-lg leading-relaxed">
      TerraFlo Analytics gives hydroponic and soil-based farmers real-time insights — from nutrient stability 
      to climate balance — all through accessible, low-cost data visualization.
    </p>
  </section>

  <main id="live" class="container mx-auto py-12 flex-1 fade-on-scroll">
    <h2 class="text-3xl font-semibold text-center mb-10">Live Monitoring Dashboard</h2>
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Water Temp (°C)</h3><canvas id="chartWaterTemp"></canvas></div>
      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Air Pressure (atm)</h3><canvas id="chartAirPressure"></canvas></div>
      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Humidity (%)</h3><canvas id="chartHumidity"></canvas></div>
      <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">TDS (ppm)</h3><canvas id="chartTDS"></canvas></div>
    </div>
  </main>

  <section id="recommendations" class="bg-surface-100 py-16 fade-on-scroll">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-primary-700 mb-6">Smart Recommendations</h2>
      <div class="bg-surface-200 text-lg p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-2">
        {#each recommendations as rec}
          <p>{rec}</p>
        {/each}
      </div>
    </div>
  </section>

  <section id="historical" class="bg-surface-50 py-16 fade-on-scroll">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-primary-700 mb-10">Historical Data (6-Month Trends)</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
          <h3 class="text-xl font-semibold mb-4 text-primary-700">Average Water Temp (°C)</h3>
          <canvas id="chartHistoricalTemp"></canvas>
        </div>
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
          <h3 class="text-xl font-semibold mb-4 text-primary-700">Average TDS (ppm)</h3>
          <canvas id="chartHistoricalTDS"></canvas>
        </div>
      </div>
    </div>
  </section>

  <footer class="bg-secondary-500 text-secondary-contrast-500 text-center p-6 mt-auto fade-on-scroll">
    <div class="flex flex-col items-center space-y-3">
      <img src="/tfaLogo.png" alt="TerraFlo Logo" class="h-14 w-14 rounded-full border-2 border-white shadow-md" />
      <p>© 2025 TerraFlo Analytics — Empowering Smart Farming Affordably</p>
    </div>
  </footer>

  <!-- Chatbot -->
  <div class="fixed bottom-6 right-6">
    <button class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-full shadow-lg"
      on:click={() => (chatOpen = !chatOpen)}>
      💬 {chatOpen ? 'Close TerraBot' : 'Chat with TerraBot'}
    </button>

    {#if chatOpen}
      <div class="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl w-80 max-h-[400px] flex flex-col">
        <div class="p-3 bg-primary-500 text-white rounded-t-xl font-semibold">TerraBot 🌿</div>
        <div class="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
          {#each messages as m}
            <div class={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span class={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-primary-100' : 'bg-secondary-100'}`}>
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

<style>
  @import "https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton/themes/hamlindigo.css";
  @import "https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css";

  /* Remove unwanted Tailwind directives */
  :global(html)::after {
    content: '';
  }

  /* Fade-in Scroll Animation */
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