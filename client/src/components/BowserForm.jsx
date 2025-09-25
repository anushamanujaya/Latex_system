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

  // Auto-calc profit live
  useEffect(() => {
    if (amountReceived && amountGiven) {
      setProfit(Number(amountReceived) - Number(amountGiven));
    }
  }, [amountReceived, amountGiven]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Now we only send amountReceived - backend computes cost/profit
    await api.post('/api/bowser', {
      amountReceived: +amountReceived
    });

    onSaved();
    setAmountReceived('');
    setProfit(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Bowser Profit Calculator
      </h2>

      {/* Liters */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Liters Purchased (since last sale)
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
          Purchase Cost (auto)
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
          Amount Received from Bowser
        </label>
        <input
          type="number"
          value={amountReceived}
          onChange={e => setAmountReceived(e.target.value)}
          placeholder="Enter selling total"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
          required
        />
      </div>

      {/* Profit */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profit (auto)
        </label>
        <input
          value={profit}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-green-50 text-green-700 font-bold cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Save
      </button>
    </form>
  );
}