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
    const user = users.find(u => u.username === username && u.password === password);
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
    if (users.find(u => u.username === username)) {
      loginError = '❌ Username exists.';
      return;
    }
    users.push({ username, password });
    loginError = '✅ Account created! Please log in.';
    isRegister = false;
    username = '';
    password = '';
  }

  // --- Live sensor data ---
  let liveData = [
    { waterTemp: 22.3, airTemp: 24.1, airPressure: 1.01, humidity: 63, tds: 890 },
    { waterTemp: 22.5, airTemp: 24.0, airPressure: 1.02, humidity: 61, tds: 905 },
    { waterTemp: 22.8, airTemp: 25.0, airPressure: 1.00, humidity: 60, tds: 915 }
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
      recommendations.push("⚠️ Water temperature is too high (>26 °C). Roots may suffer from oxygen deprivation and nutrient uptake issues. Consider using a water chiller or insulating the reservoir.");
    else if (latest.waterTemp > IDEAL_WATER_TEMP[1])
      recommendations.push("🌡️ Water temperature slightly high (24–26 °C). Optimal growth occurs between 18–24 °C — slightly cooler water keeps roots oxygenated.");
    else if (latest.waterTemp < IDEAL_WATER_TEMP[0])
      recommendations.push("❄️ Water too cold (<18 °C). Root metabolism slows and nutrient absorption drops. Use a submersible heater or insulate pipes.");

    // --- AIR TEMPERATURE ---
    if (latest.airTemp > 28)
      recommendations.push("🔥 Air temperature high (>28 °C). Heat stress may stunt growth or cause tip burn in lettuce. Increase ventilation or use reflective shading.");
    else if (latest.airTemp < 18)
      recommendations.push("🥶 Air temperature below optimal (<18 °C). Growth slows; consider mild heating or enclosing the grow area to retain warmth.");
    else if (latest.airTemp > IDEAL_AIR_TEMP[1])
      recommendations.push("⚠️ Air temperature slightly high (26–28 °C). Maintain between 20–26 °C for steady transpiration and nutrient movement.");

    // --- HUMIDITY ---
    if (latest.humidity < IDEAL_HUMIDITY[0])
      recommendations.push("💧 Humidity low (<55 %). Plants may transpire too quickly, leading to nutrient imbalance. Increase misting, or slow fan speed.");
    else if (latest.humidity > IDEAL_HUMIDITY[1])
      recommendations.push("💨 Humidity high (>70 %). Mold, mildew, or calcium deficiency can occur. Improve airflow or reduce mist cycles.");

    // --- TDS / NUTRIENT STRENGTH ---
    if (latest.tds > 1500)
      recommendations.push("🧪 TDS too high (>1500 ppm). Nutrient burn risk! Dilute with fresh water to bring levels down to ~1000 ppm.");
    else if (latest.tds > IDEAL_TDS[1])
      recommendations.push("⚠️ TDS slightly above ideal (1200–1500 ppm). Ideal range for leafy greens is 800–1200 ppm. Add water if tips show burn.");
    else if (latest.tds < 600)
      recommendations.push("🌿 TDS too low (<600 ppm). Plants may be nutrient-deficient — add nutrient concentrate to reach 800–1200 ppm.");
    else if (latest.tds < IDEAL_TDS[0])
      recommendations.push("🧩 TDS slightly below ideal (600–800 ppm). Consider mild nutrient addition for stronger vegetative growth.");

    // --- AIR PRESSURE ---
    if (latest.airPressure < IDEAL_AIR_PRESSURE[0])
      recommendations.push("🌫️ Air pressure slightly low (<0.98 atm). Weather shifts or storms may alter humidity and evaporation — monitor stability.");
    else if (latest.airPressure > IDEAL_AIR_PRESSURE[1])
      recommendations.push("☀️ Air pressure higher than normal (>1.05 atm). Usually stable conditions, but minor stress possible if rapid changes occur.");

    // --- MULTI-CONDITION INSIGHTS ---
    if (latest.airTemp > 26 && latest.humidity > 70)
      recommendations.push("⚠️ High heat + high humidity detected. This combo promotes fungal growth. Increase ventilation immediately.");
    if (latest.airTemp < 20 && latest.humidity < 55)
      recommendations.push("🌬️ Cool and dry air — expect slower photosynthesis. Slightly raise humidity or warmth for balanced VPD (Vapor Pressure Deficit).");
    if (latest.waterTemp > 25 && latest.tds > 1200)
      recommendations.push("🚨 High water temp + high TDS — dangerous combination! Oxygen solubility drops and nutrient burn likely. Dilute and cool water.");

    if (recommendations.length === 0)
      recommendations.push("✅ All systems within optimal hydroponic ranges — excellent environmental balance! Keep monitoring stability for consistent yields.");
  }

  async function sendMessage() {
    if (!chatInput.trim()) return;
    messages = [...messages, { role: 'user', text: chatInput }];
    const userMessage = chatInput;
    chatInput = '';

    await new Promise(r => setTimeout(r, 800));

    let reply = '';
    if (userMessage.toLowerCase().includes('water')) reply = "💧 Water temps look ideal between 18–24 °C for root health.";
    else if (userMessage.toLowerCase().includes('humidity')) reply = "Humidity around 60–70 % is optimal for most leafy greens 🌱.";
    else if (userMessage.toLowerCase().includes('tds')) reply = "Target TDS is 800–1200 ppm depending on crop type.";
    else if (userMessage.toLowerCase().includes('temperature')) reply = "Air temp should stay between 20–26 °C — stable growth zone.";
    else reply = "I'm still learning! Try asking about water, humidity, temperature, or nutrients.";

    messages = [...messages, { role: 'bot', text: reply }];
  }

  function handleScroll() {
    const elements = document.querySelectorAll('.fade-on-scroll');
    const triggerBottom = window.innerHeight * 0.9;

    elements.forEach(el => {
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

    // --- Live Dashboard Charts ---
    new Chart(document.getElementById('chartWaterTemp'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Water Temp (°C)', data: [21, 22, 22.5, 22.2, 21.8], borderColor: '#4CAF50', fill: false, tension: 0.3 }]
      }
    });

    new Chart(document.getElementById('chartAirPressure'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Air Pressure (atm)', data: [1.02, 1.01, 1.03, 1.00, 1.01], backgroundColor: '#90CAF9' }]
      }
    });

    new Chart(document.getElementById('chartHumidity'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Humidity (%)', data: [67, 65, 63, 62, 64], borderColor: '#FF9800', fill: false, tension: 0.3 }]
      }
    });

    new Chart(document.getElementById('chartTDS'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'TDS (ppm)', data: [850, 870, 880, 890, 865], borderColor: '#9C27B0', fill: false, tension: 0.3 }]
      }
    });

    // --- Historical Charts ---
    new Chart(document.getElementById('chartHistoricalTemp'), {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{ label: 'Avg Water Temp (°C)', data: [19.8, 21.2, 23.1, 24.6, 22.9, 20.4], borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.2)', fill: true, tension: 0.4 }]
      }
    });

    new Chart(document.getElementById('chartHistoricalTDS'), {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{ label: 'Avg TDS (ppm)', data: [820, 870, 930, 1100, 960, 880], borderColor: '#9C27B0', backgroundColor: 'rgba(156,39,176,0.2)', fill: true, tension: 0.4 }]
      }
    });
  }
</script>

{#if !loggedIn}
  <!-- LOGIN / REGISTER -->
  <div class="flex items-center justify-center min-h-screen bg-surface-50">
    <div class="bg-surface-200 p-12 rounded-xl shadow-xl w-96 text-center">
      <h2 class="text-2xl font-bold text-primary-700 mb-6">{isRegister ? 'Create Account' : 'Welcome to TerraFlo'}</h2>
      <input class="w-full p-3 mb-4 rounded border border-gray-300" placeholder="Username" bind:value={username} />
      <input type="password" class="w-full p-3 mb-4 rounded border border-gray-300" placeholder="Password" bind:value={password} />
      {#if loginError}<p class="text-red-600 mb-2">{loginError}</p>{/if}

      {#if isRegister}
        <button on:click={register} class="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold mb-2">Register</button>
        <p class="text-sm">Already have an account? <button class="text-primary-700 font-bold" on:click={()=>{isRegister=false; loginError='';}}>Login</button></p>
      {:else}
        <button on:click={login} class="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold mb-2">Login</button>
        <p class="text-sm">Don't have an account? <button class="text-primary-700 font-bold" on:click={()=>{isRegister=true; loginError='';}}>Register</button></p>
      {/if}
    </div>
  </div>
{:else}
  <!-- DASHBOARD -->
  <div class="bg-surface-100 text-surface-900 min-h-screen flex flex-col font-sans">
    <!-- HEADER -->
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

    <!-- ABOUT -->
    <section id="about" class="bg-surface-50 py-20 text-center fade-on-scroll">
      <h2 class="text-4xl font-bold mb-4 text-primary-700">Affordable Intelligence for Sustainable Growth</h2>
      <p class="max-w-2xl mx-auto text-lg leading-relaxed">
        TerraFlo Analytics gives hydroponic and soil-based farmers real-time insights — from nutrient stability 
        to climate balance — all through accessible, low-cost data visualization.
      </p>
    </section>

    <!-- LIVE DASHBOARD -->
    <main id="live" class="container mx-auto py-12 flex-1 fade-on-scroll">
      <h2 class="text-3xl font-semibold text-center mb-10">Live Monitoring Dashboard</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Water Temp (°C)</h3><canvas id="chartWaterTemp"></canvas></div>
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Air Pressure (atm)</h3><canvas id="chartAirPressure"></canvas></div>
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Humidity (%)</h3><canvas id="chartHumidity"></canvas></div>
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">TDS (ppm)</h3><canvas id="chartTDS"></canvas></div>
      </div>
    </main>

    <!-- RECOMMENDATIONS -->
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

    <!-- HISTORICAL -->
    <section id="historical" class="bg-surface-50 py-16 fade-on-scroll">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-semibold text-primary-700 mb-10">Historical Data (6-Month Trends)</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Average Water Temp (°C)</h3><canvas id="chartHistoricalTemp"></canvas></div>
          <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96"><h3 class="text-xl font-semibold mb-4 text-primary-700">Average TDS (ppm)</h3><canvas id="chartHistoricalTDS"></canvas></div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-secondary-500 text-secondary-contrast-500 text-center p-6 mt-auto fade-on-scroll">
      <div class="flex flex-col items-center space-y-3">
        <img src="/tfaLogo.png" alt="TerraFlo Logo" class="h-14 w-14 rounded-full border-2 border-white shadow-md" />
        <p>© 2025 TerraFlo Analytics — Empowering Smart Farming Affordably</p>
      </div>
    </footer>

    <!-- CHATBOT -->
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
            <button class="bg-primary-500 hover:bg-primary-600 text-white px-3 rounded-lg" on:click={sendMessage}>Send</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @import "https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton/themes/hamlindigo.css";
  @import "https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css";

  :global(html)::after { content: ''; }

  .fade-on-scroll { opacity: 0; transform: translateY(40px); transition: all 0.8s ease-out; }
  .fade-on-scroll.show { opacity: 1; transform: translateY(0); }
</style>
