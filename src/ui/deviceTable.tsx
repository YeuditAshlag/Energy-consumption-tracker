

'use client'


import React, { useState } from 'react';
import useDeviceData from '../hooks/useDeviceData';
import AddDevicePopup from './addDevicePopupProps';
import '../styles/style.css';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ObjectId } from 'mongodb';
import { calculateDailyCost, calculateMonthlyCost, calculateWeeklyCost } from '@/utils/calculations';
import Swal from 'sweetalert2';

type Device = {
  _id?: ObjectId | string;
  name: string;
  power: number;
  dailyUsageHours: number;
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
};

const DeviceTable = () => {
  const { data: devices, mutate } = useDeviceData();
  const [devicesState, setDevices] = useState<Device[]>([]); 
  const [isAddDevicePopupOpen, setIsAddDevicePopupOpen] = useState(false);

  const handleAddDevice = async (newDevice: Device) => {
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });
  
      if (response.ok) {
        const addedDevice = await response.json();
        setDevices((prevDevices) => [...prevDevices, addedDevice]);
        await mutate();  
        setIsAddDevicePopupOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to add device:', errorData);
        Swal.fire('Error!', errorData.message || 'There was an error adding the device.', 'error');
      }
    } catch (error) {
      console.error('Error while adding device:', error);
      Swal.fire('Error!', 'There was an error adding the device.', 'error');
    }
  };

  const handleDailyUsageChange = async (deviceId: string, newUsage: number) => {
    const deviceToUpdate = devices?.find((d) => d._id === deviceId);
    if (!deviceToUpdate) return;

    const updatedDailyCost = calculateDailyCost(deviceToUpdate.power, newUsage);
    const updatedWeeklyCost = calculateWeeklyCost(updatedDailyCost);
    const updatedMonthlyCost = calculateMonthlyCost(updatedDailyCost);

    const updatedDevice = {
      ...deviceToUpdate,
      dailyUsageHours: newUsage,
      dailyCost: updatedDailyCost,
      weeklyCost: updatedWeeklyCost,
      monthlyCost: updatedMonthlyCost,
    };

    const updatedDevices = devices?.map((device) =>
      device._id === deviceId ? updatedDevice : device
    );
    mutate(updatedDevices, false);

    await fetch(`/api/devices`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: deviceId,
        dailyUsageHours: newUsage,
        dailyCost: updatedDailyCost,
        weeklyCost: updatedWeeklyCost,
        monthlyCost: updatedMonthlyCost,
      }),
    });

    mutate();
  };

  const handleDeleteDevice = async (deviceId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this device?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/devices`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: deviceId }),
          });
  
          if (response.ok) {
            await mutate(); // Update devices list
            Swal.fire('Deleted!', 'The device has been deleted.', 'success');
          } else {
            const errorData = await response.json();
            console.warn("Unexpected response:", errorData);
            Swal.fire('Error!', errorData.message || 'There was an error deleting the device.', 'error');
          }
        } catch (error) {
          console.error("Error deleting device:", error);
          Swal.fire('Error!', 'There was an error deleting the device.', 'error');
        }
      }
    });
  };

  const columnHelper = createColumnHelper<Device>();
  const columns = [
    columnHelper.accessor('name', { header: 'Device Name' }),
    columnHelper.accessor('power', { header: 'Power (W)' }),
    columnHelper.accessor('dailyUsageHours', {
      header: 'Daily Usage Hours',
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.dailyUsageHours}
          onChange={(e) =>
            handleDailyUsageChange(row.original._id as string, parseFloat(e.target.value))
          }
          className="border rounded p-1 w-full h-full"
        />
      ),
    }),
    columnHelper.accessor('dailyCost', {
      header: 'Daily Cost',
      cell: ({ row }) => (
        <span> ₪ {row.original.dailyCost.toFixed(3)}</span>
      ),
    }),
    columnHelper.accessor('weeklyCost', {
      header: 'Weekly Cost',
      cell: ({ row }) => (
        <span>₪ {row.original.weeklyCost.toFixed(3)}</span>
      ),
    }),
    columnHelper.accessor('monthlyCost', {
      header: 'Monthly Cost',
      cell: ({ row }) => (
        <span>₪ {row.original.monthlyCost.toFixed(3)}</span>
      ),
    }),
    {
      id: 'delete',
      header: 'Delete',
      cell:({ row }: { row: any }) => (
        <td className="flex justify-center items-center border-none">
          <i
            className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => handleDeleteDevice(row.original._id as string)}
          ></i>
        </td>
      ),
    }
    
  ];

  const table = useReactTable({
    data: devices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <button onClick={() => setIsAddDevicePopupOpen(true)} className="mb-4 p-2 bg-red-500 hover:bg-red-700 text-white rounded shadow-md hover:bg-blue-600 transition">
        Add Device
      </button>
      {isAddDevicePopupOpen && (
        <AddDevicePopup
          onAddDevice={handleAddDevice}
          onClose={() => setIsAddDevicePopupOpen(false)}
        />
      )}
      <table className="min-w-full table-auto border-separate border-spacing-2">
        <thead className="bg-gray-800 text-white">
          <tr>
            {table.getHeaderGroups().map(headerGroup => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-left font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.original._id as string} className="hover:bg-gray-100 transition">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceTable;
