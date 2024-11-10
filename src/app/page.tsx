

// src/app/page.tsx
import DeviceTable from '../ui/deviceTable';
import '../styles/globals.css';


export default function HomePage() {
  return (
    <main className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-910 mb-6">Energy Consumption Tracker</h1>
      <DeviceTable />
    </main>
  );
}
