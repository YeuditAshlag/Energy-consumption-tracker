// // useDeviceData.ts

// // "use client" directive at the top
// 'use client';

// import useSWR from 'swr';
// import { Device } from '@/types/device';

// // Define the fetcher function only once
// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error(`Error fetching data: ${res.status}`);
//   }
//   return await res.json();
// };

// // Define useDeviceData hook only once
// const useDeviceData = () => {
//   const { data, error, mutate } = useSWR<Device[]>('/api/devices', fetcher);

//   return {
//     data,
//     isLoading: !error && !data,
//     error,
//     mutate,
//   };
// };

// export default useDeviceData;

// useDeviceData.ts

'use client';

import useSWR from 'swr';
import { Device } from '@/types/device';

// Define the fetcher function only once
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error fetching data: ${res.status}`);
  }
  return await res.json();
};

// Define useDeviceData hook only once
const useDeviceData = () => {
  const { data, error, mutate } = useSWR<Device[]>('/api/devices', fetcher);

  const updateDevices = (newDevice: Device) => {
    // עדכון המכשירים במיידי (בלי לקרוא מחדש את הנתונים מהשרת)
    if (data) {
      mutate([...data, newDevice], false);
    }
  };

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
    updateDevices, // מוסיפים את הפונקציה לעדכון המכשירים
  };
};

export default useDeviceData;
