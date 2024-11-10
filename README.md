# 🌍 **Energy Consumption Tracking System** 🌍

Welcome to the **Energy Consumption Tracking System**! This project is designed to help users track and manage the energy consumption of smart home devices. By allowing users to input daily usage hours for each device, this system calculates and displays daily, weekly, and monthly consumption costs, providing a clear picture of energy expenses. 🌱⚡

---

## 📌 **Project Overview**

The **Energy Consumption Tracking System** enables users to:
- **Add, edit, and delete** smart home devices from their device list.
- **Calculate energy costs** based on real-time updates to daily usage.
- **View summaries** of daily, weekly, and monthly consumption costs.
- **Easily adjust** each device’s usage hours to observe instant impact on energy costs.

The system offers a responsive, minimalistic interface, allowing users to optimize energy consumption and reduce costs efficiently.

---

## 🛠️ **Technologies Used**

This system is built on a modern, scalable tech stack:
- **Framework**: **Next.js** (v13+) with TypeScript for seamless server-side rendering and frontend interactivity.
- **Frontend Library**: **React** (v18+) to create a dynamic and responsive user experience.
- **Database**: **MongoDB Atlas** for secure and efficient data storage and retrieval.
- **State Management**: **TanStack React Table** for table data interactions and management.
- **Styling**: **Tailwind CSS** for clean and minimal design.
- **Data Fetching**: **SWR** library to ensure efficient data synchronization with the server.

This tech stack ensures reliability, high performance, and real-time updates, making it ideal for managing energy consumption efficiently.

---

## ⚙️ **Table Structure**

The table is a central feature of this project, allowing users to manage and view energy costs for various devices.

### Table Columns:
- **Device Name**: The name of the device (e.g., light bulb, air conditioner, refrigerator).
- **Power (Watts)**: The device's power consumption in watts, set as a fixed value per device.
- **Daily Usage Hours**: A numeric input for users to enter the device's daily operational hours.
- **Daily Consumption Cost**: Displays the calculated daily consumption cost.
- **Weekly Consumption Cost**: Shows the weekly cost based on daily usage.
- **Monthly Consumption Cost**: Displays the monthly cost based on daily usage.

The table is built using **TanStack React Table**, which allows efficient management of state and data interactions. All table data is stored in a **MongoDB Atlas** cluster.

### Cost Calculations
Consumption costs are calculated using the following formulas:

- **Daily Cost** = Device Power × Daily Usage Hours × 0.001 × Electricity Cost per kWh
  - Example: For a device with 100W power and 5 daily usage hours:  
    `Daily Cost = 100 × 5 × 0.001 × 0.5 = 0.25 ₪`

- **Weekly Cost** = Daily Cost × 7
  - Example:  
    `Weekly Cost = 0.25 × 7 = 1.75 ₪`

- **Monthly Cost** = Daily Cost × 30
  - Example:  
    `Monthly Cost = 0.25 × 30 = 7.5 ₪`

**Electricity Cost per kWh** is set at **0.5 ₪**.

### Real-Time Updates
When users modify the **Daily Usage Hours**, all consumption costs (daily, weekly, monthly) are instantly recalculated, ensuring that users always see the most up-to-date cost data.

---

## 🚀 **Getting Started**

Here’s how to set up the project on your local machine:

### Step 1: Clone the Repository
First, clone the project repository and navigate into the project folder:
```bash
git clone <repository-url>
cd <project-folder>
