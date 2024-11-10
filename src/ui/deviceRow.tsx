// src/components/DeviceRow.tsx
import React, { useState } from 'react';
import { Device } from '../types/device';
import '../styles/globals.css';

import { calculateDailyCost, calculateWeeklyCost, calculateMonthlyCost } from '@/utils/calculations';

interface DeviceRowProps {
  device: Device;
}

const DeviceRow: React.FC<DeviceRowProps> = ({ device }) => {
  const [dailyUsageHours, setDailyUsageHours] = useState(device.dailyUsageHours);

  const dailyCost = calculateDailyCost(device.power, dailyUsageHours);
  const weeklyCost = calculateWeeklyCost(dailyCost);
  const monthlyCost = calculateMonthlyCost(dailyCost);

  const handleUsageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsage = parseFloat(event.target.value);
    setDailyUsageHours(newUsage);

    // שליחה לשרת
    await fetch(`api/devices`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: device._id, dailyUsageHours: newUsage }),
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">{device.name}</td>
      <td className="border px-4 py-2">{device.power} W</td>
      <td className="border px-4 py-2">
        <input
          type="number"
          value={dailyUsageHours}
          onChange={handleUsageChange}
          className="border rounded p-1"
        />
      </td>
      <td className="border px-4 py-2">{dailyCost.toFixed(2)} ₪</td>
      <td className="border px-4 py-2">{weeklyCost.toFixed(2)} ₪</td>
      <td className="border px-4 py-2">{monthlyCost.toFixed(2)} ₪</td>
    </tr>
  );
};

export default DeviceRow;
