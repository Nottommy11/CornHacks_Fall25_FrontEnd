<!DOCTYPE html>
<html lang="en" data-theme="hamlindigo">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TerraFlo Analytics | Affordable Smart Farming</title>

  <!-- Skeleton + Theme -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@skeletonlabs/skeleton/themes/hamlindigo.css">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <title>TerraFlo Analytics Logo</title>
  <style>
    /* Ensure the image is positioned at the top-left */
    .top-left-image {
      position: absolute;
      top: 0;
      left: 5;
      width: 80px;
      height: auto;
    }

    canvas {
        width: 100% !important;
    height: 100% !important;
    }
  </style>
</head>

<body class="bg-surface-100 text-surface-900 min-h-screen flex flex-col font-sans">

  <!-- Header -->
  <header class="bg-primary-500 text-primary-contrast-500 p-6 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">TerraFlo Analytics</h1>
      <nav class="space-x-4 text-lg">
        <a href="#about" class="hover:underline">About</a>
        <a href="#live" class="hover:underline">Live</a>
        <a href="#historical" class="hover:underline">Historical</a>
        <a href="#contact" class="hover:underline">Contact</a>
      </nav>
    </div>
  </header>

  <img src="tfaLogo.png" alt="TerraFlo Analytics Logo" class="top-left-image">

  <!-- Hero / About -->
  <section id="about" class="bg-surface-50 py-20 text-center">
    <div class="container mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-primary-700">Affordable Intelligence for Sustainable Growth</h2>
      <p class="max-w-2xl mx-auto text-lg leading-relaxed">
        TerraFlo Analytics helps hydroponic and traditional farmers gain real-time insights into their operations —
        from nutrient balance to light optimization — without the heavy costs of big data systems.
        Our mission: <strong>make precision agriculture accessible to everyone.</strong>
      </p>
    </div>
  </section>

  <!-- Live Dashboard -->
  <main id="live" class="container mx-auto py-12 flex-1">
  <h2 class="text-3xl font-semibold text-center mb-10">Live Monitoring Dashboard</h2>
 
  <div class="grid md:grid-cols-2 gap-8">
     
    <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
      <h3 class="text-xl font-semibold mb-4 text-primary-700">Water Temp(°C)</h3>
      <canvas id="chartWaterTemp"></canvas>
    </div>


    <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
      <h3 class="text-xl font-semibold mb-4 text-primary-700">Air Pressure (atmospheres)</h3>
      <canvas id="chartAirPressure"></canvas>
    </div>


    <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
      <h3 class="text-xl font-semibold mb-4 text-primary-700">Humidity (g/m³)</h3>
      <canvas id="chartHumidity"></canvas>
    </div>


    <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
      <h3 class="text-xl font-semibold mb-4 text-primary-700">Total Dissolved Particles (Parts Per Million)</h3>
      <canvas id="chartTotalDissolvedParticles"></canvas>
    </div>
  </div>
  </main>

  <section id="recommendations" class="bg-surface-100 py-16">
    <div class="container mx-auto text-center">
        <h2 class="text-3xl font-semibold text-primary-700 mb-6">Smart Recommendations</h2>
        <p class="max-w-2xl mx-auto text-lg mb-8">
        Based on current live readings, TerraFlo suggests the following actions to optimize growth:
        </p>
        
        <div id="recommendation-box" class="bg-surface-200 text-lg p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
        Loading recommendations...
        </div>
    </div>
  </section>

  <!-- Historical Data -->
  <section id="historical" class="bg-surface-50 py-12">
    <div class="container mx-auto text-center mb-10">
        <h2 class="text-3xl font-semibold text-primary-700">Historical Growth & Comparisons</h2>
        <p class="max-w-2xl mx-auto text-lg">
            Review trends over time — compare performance month-to-month and visualize how small optimizations
            improve yield, stability, and cost savings.
        </p>
    </div>

    <div class="container mx-auto grid md:grid-cols-2 gap-8">
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
            <h3 class="text-xl font-semibold mb-4 text-primary-700">Nutrient Levels (6-Month Average)</h3>
            <canvas id="chartHistoricalEC"></canvas>
        </div>
        <div class="bg-surface-200 p-6 rounded-xl shadow-lg h-96">
            <h3 class="text-xl font-semibold mb-4 text-primary-700">Yield Growth (%) Over Time</h3>
            <canvas id="chartYield"></canvas>
        </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-secondary-500 text-secondary-contrast-500 text-center p-6 mt-auto">
    © 2025 TerraFlo Analytics — Empowering Smart Farming Affordably
  </footer>

  <!-- Placeholder for AI Chatbot -->
  <div id="chatbot" class="fixed bottom-6 right-6">
    <button class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-full shadow-lg">
      💬 Chat with TerraBot
    </button>
  </div>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" integrity="sha384-o6InL+o0sygQvFzPrppvjhZRTV7rqAoJ/ivXxblfB+iI9nswsnbMZbW7INiiZ+KU" crossorigin="anonymous"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof Chart === "undefined") {
            console.error("Chart.js failed to load!");
            return;
        }

        const { registerables } = Chart;
        Chart.register(...registerables);

        const liveData = [
        { "id": 1, "tds": 850, "airTemp": 23.5, "airPressure": 101.2, "humidity": 68, "waterTemp": 21.4 },
        { "id": 2, "tds": 870, "airTemp": 23.8, "airPressure": 101.1, "humidity": 67, "waterTemp": 21.6 },
        { "id": 3, "tds": 890, "airTemp": 24.0, "airPressure": 101.0, "humidity": 66, "waterTemp": 21.8 },
        { "id": 4, "tds": 910, "airTemp": 24.3, "airPressure": 100.9, "humidity": 65, "waterTemp": 22.0 },
        { "id": 5, "tds": 925, "airTemp": 24.6, "airPressure": 100.8, "humidity": 64, "waterTemp": 22.2 }
        ];

        const historicalMonths = ['May', 'June', 'July', 'Aug', 'Sept', 'Oct'];
        const ecLevels = [1.2, 1.4, 1.6, 1.5, 1.7, 1.8];
        const yieldGrowth = [85, 92, 95, 96, 98, 97];

        const ids = liveData.map(item => `Point ${item.id}`);
        const waterTempData = liveData.map(item => item.waterTemp); 
        const tdsData = liveData.map(item => item.tds);
        const humidityData = liveData.map(item => item.humidity);
        const airPressureData = liveData.map(item => item.airPressure);

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false, // Allows charts to fill the container size
            borderWidth: 2,
            tension: 0.3,
            scales: {
                y: { beginAtZero: false }
            }
        };


        // Chart 1: Water Temp
        new Chart(document.getElementById('chartWaterTemp'), {
            type: 'line',
            data: {
                labels: ids,
                datasets: [{
                    label: 'Water Temp (°C)',
                    data: waterTempData,
                    borderColor: '#33C3F0',
                    backgroundColor: 'rgba(51,195,240,0.2)',
                }]
            },
            options: chartOptions
        });


        // Chart 2: Air Pressure
        new Chart(document.getElementById('chartAirPressure'), {
            type: 'line',
            data: {
                labels: ids,
                datasets: [{
                    label: 'Air Pressure (kPa)',
                    data: airPressureData,
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245,158,11,0.2)',
                }]
            },
            options: chartOptions
        });
    
        // Chart 3: Humidity
        new Chart(document.getElementById('chartHumidity'), {
            type: 'line',
            data: {
                labels: ids,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16,185,129,0.2)',
                }]
            },
            options: chartOptions
        });


        // Chart 4: Total Dissolved Particles (TDS)
        new Chart(document.getElementById('chartTotalDissolvedParticles'), {
            type: 'line',
            data: {
                labels: ids,
                datasets: [{
                    label: 'TDS (ppm)',
                    data: tdsData,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139,92,246,0.2)',
                }]
            },
            options: chartOptions
        });


        // --- 4. DEFINE HISTORICAL CHARTS (2) ---
    
        // Chart 5: Historical EC (Nutrient Levels)
        new Chart(document.getElementById('chartHistoricalEC'), {
            type: 'bar',
            data: {
                labels: historicalMonths,
                datasets: [{
                    label: 'EC Level (mS/cm)',
                    data: ecLevels,
                    backgroundColor: '#DC2626', // Red
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'EC (mS/cm)'
                        }
                    }
                }
            }
        });


        // Chart 6: Yield Growth
        new Chart(document.getElementById('chartYield'), {
            type: 'line',
            data: {
                labels: historicalMonths,
                datasets: [{
                    label: 'Yield (%)',
                    data: yieldGrowth,
                    borderColor: '#14B8A6', // Cyan
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 80, // Start higher to emphasize growth
                        max: 100,
                        title: {
                            display: true,
                            text: 'Yield Percentage'
                        }
                    }
                }
            }
        });

        // --- Generate Recommendation Example ---
        const recBox = document.getElementById("recommendation-box");
        const latest = liveData[liveData.length - 1];
        let recommendations = [];

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

        recBox.innerHTML = recommendations.map(r => `<p>${r}</p>`).join("");
    });
  </script>
  
  <script src="/chat.js"></script>
  <script>
  const chatButton = document.querySelector("#chatbot button");
    chatButton.addEventListener("click", async () => {
        const userMessage = prompt("Ask TerraBot a question about your plants:");
        if (!userMessage) return;
        chatButton.disabled = true;
        chatButton.textContent = "💬 Thinking...";

        try {
        const reply = await sendMessage(userMessage);
        alert("TerraBot: " + reply);
        } catch (err) {
        alert("Error: Could not reach AI.");
        console.error(err);
        }

        chatButton.disabled = false;
        chatButton.textContent = "💬 Chat with TerraBot";
    });
  </script>

</body>
</html>