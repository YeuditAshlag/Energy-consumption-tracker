// src/app/page.tsx
import DeviceTable from '../ui/deviceTable';
import '../styles/globals.css';


export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Consumption Tracker</h1>
      <DeviceTable />
    </main>
  );
}
