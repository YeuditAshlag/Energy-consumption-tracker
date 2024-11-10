


import React, { useState } from 'react';
import { Device } from '@/types/device';
import { calculateDailyCost, calculateWeeklyCost, calculateMonthlyCost } from '@/utils/calculations';
import '../styles/globals.css';
import '../styles/style.css'

interface AddDevicePopupProps {
  onAddDevice: (newDevice: Device) => Promise<void>;
  onClose: () => void;
}

const AddDevicePopup: React.FC<AddDevicePopupProps> = ({ onClose, onAddDevice }) => {
  const [device, setDevice] = useState<Device>({
    name: '',
    power: 0,
    dailyUsageHours: 0,
    dailyCost: 0,
    weeklyCost: 0,
    monthlyCost: 0,
  });
  const [error, setError] = useState<string>('');

  const handleAdd = async () => {
    // to calculate daily, weekly, and monthly costs
    const dailyCost = calculateDailyCost(device.power, device.dailyUsageHours);
    const weeklyCost = calculateWeeklyCost(dailyCost);
    const monthlyCost = calculateMonthlyCost(dailyCost);

    // move the new device with calculated costs to onAddDevice
    await onAddDevice({ ...device, dailyCost, weeklyCost, monthlyCost });
    onClose();
  };



  //Checking if all fields are full
  const isFormValid = device.name && device.power > 0 && device.dailyUsageHours > 0;

  return (
    <div className="popup-overlay">
      <div className="popup bg-white p-4 rounded shadow w-full max-w-sm">
        <input
          type="text"
          placeholder="Device Name"
          value={device.name}
          onChange={(e) => setDevice({ ...device, name: e.target.value })}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Power (W)"
          value={device.power}
          onChange={(e) => setDevice({ ...device, power: parseFloat(e.target.value) })}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Daily Usage Hours"
          value={device.dailyUsageHours}
          onChange={(e) => setDevice({ ...device, dailyUsageHours: parseFloat(e.target.value) })}
          className="border rounded p-2 mb-2 w-full"
        />
        <button
          onClick={handleAdd}
          className={`bg-green-500 text-white p-2 rounded mr-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid} //The button is defined as disable as long as all the fields are not filled
        >
          Add
        </button>
        <button onClick={onClose} className="bg-red-500 text-white p-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddDevicePopup;
