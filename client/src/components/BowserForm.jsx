import { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function BowserForm({ onSaved }) {
  const [liters, setLiters] = useState(0);
  const [kilos, setKilos] = useState(0);
  const [amountGiven, setAmountGiven] = useState(0);
  const [amountReceived, setAmountReceived] = useState('');
  const [profit, setProfit] = useState(0);

  // Load auto values from /marker/profit
  useEffect(() => {
    const fetchStock = async () => {
      const stock = await api.get('/api/marker/profit');
      setLiters(stock.data.totalLiters);
      setKilos(stock.data.totalKilos);
      setAmountGiven(stock.data.totalAmount);
    };
    fetchStock();
  }, []);

  // Auto-calculate profit live
  useEffect(() => {
    if (amountReceived && amountGiven) {
      setProfit(Number(amountReceived) - Number(amountGiven));
    }
  }, [amountReceived, amountGiven]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/bowser', {
      litersGiven: liters,
      kilosGiven: kilos,
      amountGiven,
      amountReceived: +amountReceived,
      profit,
    });

    await api.post('/api/marker'); // ✅ place new marker
    onSaved();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Profit Finder
      </h2>

      {/* Liters */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Liters Purchased
        </label>
        <input
          value={liters}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Kilos */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Kilos Purchased
        </label>
        <input
          value={kilos}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Amount Given */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Amount Given (Auto)
        </label>
        <input
          value={amountGiven}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Amount Received */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Amount Received
        </label>
        <input
          type="number"
          value={amountReceived}
          onChange={e => setAmountReceived(e.target.value)}
          placeholder="Enter selling total"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Profit */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profit (Auto)
        </label>
        <input
          value={profit}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-green-50 text-green-700 font-bold cursor-not-allowed"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Save
      </button>
    </form>
  );
}