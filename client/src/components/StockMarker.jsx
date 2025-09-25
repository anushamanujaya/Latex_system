import { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function StockMarker({ onMarked }) {
  const [stats, setStats] = useState(null);

  const load = async () => {
    const res = await api.get('/api/marker/profit');
    setStats(res.data);
  };

  const mark = async () => {
    await api.post('/api/marker');
    await load();
    onMarked();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">Current Stock Summary (since last sale)</h2>
      {stats && (
        <div className="space-y-1">
          <div>Liters: {stats.totalLiters.toFixed(2)}</div>
          <div>Kilograms: {stats.totalKilos.toFixed(2)}</div>
          <div>Amount Spent: Rs. {stats.totalAmount.toFixed(2)}</div>
        </div>
      )}
      <button
        onClick={mark}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Mark Current Stock as Sold
      </button>
    </div>
  );
}
   