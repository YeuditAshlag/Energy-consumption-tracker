


'use client'

import React, {  useState } from 'react';
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
      // Send new device to API
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
        await mutate();  // לרפרש
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
            body: JSON.stringify({ id: deviceId }), // שליחת ה-ID למחיקה
          });
  
          if (response.ok) {
            await mutate(); // עדכון המכשירים
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
    columnHelper.accessor('dailyCost', { header: 'Daily Cost' }),
    columnHelper.accessor('weeklyCost', { header: 'Weekly Cost' }),
    columnHelper.accessor('monthlyCost', { header: 'Monthly Cost' }),
    {
      id: 'delete',
      header: 'Delete',
      cell:({ row }: { row: any }) => (
        <i className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => handleDeleteDevice(row.original._id as string)}
        ></i>
      ),
    },
  ];

  const table = useReactTable({
    data: devices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <button onClick={() => setIsAddDevicePopupOpen(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Add Device
      </button>
      {isAddDevicePopupOpen && (
        <AddDevicePopup
          onAddDevice={handleAddDevice}
          onClose={() => setIsAddDevicePopupOpen(false)}
        />
      )}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {table.getHeaderGroups().map(headerGroup => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border px-4 py-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.original._id as string}>
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
