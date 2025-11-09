# TerraFlo Frontend

**TerraFlo** is a data-driven hydroponic farming dashboard built with **SvelteKit**, **Tailwind CSS**, and **Chart.js**.  
It visualizes environmental and nutrient data such as water temperature, humidity, and total dissolved solids (TDS), and provides intelligent recommendations to improve plant growth and system efficiency.

---

## Overview

TerraFlo’s frontend serves as an interactive control panel for growers to monitor and optimize hydroponic environments.  
Users can view real-time charts, receive system health insights, and manage user access through a simple local authentication system.

---

## Tech Stack

| Technology | Description |
|-------------|--------------|
| **SvelteKit** | Core frontend framework for building fast, reactive UIs |
| **Tailwind CSS** | Utility-first CSS framework for responsive design |
| **Chart.js** | Data visualization library for dynamic chart rendering |
| **Node.js (Local API)** | Provides data endpoints and user authentication simulation |
| **JSON Storage** | Stores user and sensor data for demo purposes |

---

## Features

- Real-time visualization of hydroponic metrics:
  - Total Dissolved Solids (TDS)
  - Air Temperature
  - Air Pressure
  - Humidity
  - Water Temperature
- AI-style recommendations based on environmental data
- User login and registration using local JSON files
- Responsive, accessible design with Tailwind
- Smooth chart animations and clean dashboard interface

---

## Installation and Setup

To run the frontend locally:

```bash
# Clone the repository
git clone https://github.com/YourUsername/TerraFlo-Frontend.git
cd TerraFlo-Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
