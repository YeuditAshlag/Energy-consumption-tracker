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
- **Framework**: **Next.js** (v14+) with TypeScript for seamless server-side rendering and frontend interactivity.
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
git clone "https://github.com/YeuditAshlag/Energy-consumption-tracker.git"
```
cd <project-folder>


### Step 2:  Install Dependencies
```bash
npm install
```
### Step 3: Configure Environment Variables
In the root directory, create a .env.local file to set up your MongoDB URI and NEXT_PUBLIC_ELECTRICITY_COST:
```bash
NEXT_PUBLIC_ELECTRICITY_COST=0.5
MONGODB_URI=mongodb+srv://yeudit3269:Ya114293431@cluster0.s8k5t.mongodb.net/myDatabase?retryWrites=true&w=majority
```

### Step 4: Start the MongoDB Service
If you are using MongoDB locally, make sure it is running. Alternatively, MongoDB Atlas can be used directly if configured in .env.

### Step 5: Start the Development Server
Run the following command to start the application in development mode:
```bash
npm run dev
```
The app should open automatically in your browser. If not, go to http://localhost:3000 manually.

---

## 🎮 Using the System

### Adding a Device

1. Click "Add Device".
2. Fill in the following fields:
   * **Device Name**: Enter a descriptive name.
   * **Power (Watts)**: Input the device's wattage.
   * **Daily Usage Hours**: Specify the daily usage.
3. Click "Add" to add the device to your list.

### Updating Daily Usage

1. Locate the device in the table.
2. Adjust the Daily Usage Hours to update usage time.
3. The system will recalculate the costs in real time.

### Deleting a Device

1. In the Delete column, click the trash icon next to the device.
2. Confirm to remove the device from the list.

---

## 📂 Project Structure

### Frontend Components:

* **DeviceTable.tsx**: Manages and displays the device list, including all energy cost calculations.
* **AddDevicePopup.tsx**: A form for adding new devices.

### Backend:

* **server.ts**: Contains main server logic and API routes for handling device data.
* **controllers/deviceController.ts**: Manages all CRUD operations for devices in MongoDB.

### Database:

* **MongoDB Atlas**: Stores device data, including name, power, and usage details.

## Developer
Yehudit Ashlag 0583261142




