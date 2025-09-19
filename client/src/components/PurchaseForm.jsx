import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

export default function PurchaseForm({ onSaved }) {
  const [densityMap, setDensityMap] = useState({});
  const [seller, setSeller] = useState('');
  const [liters, setLiters] = useState('');
  const [density, setDensity] = useState('');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState('Not Paid');

  useEffect(() => {
    api.get('/api/density').then(r => {
      setDensityMap(r.data);
      const keys = Object.keys(r.data).sort((a, b) => a - b);
      setDensity(keys[keys.length - 1] || keys[0]);
    });
  }, []);

  const densityDecimal = densityMap[density] || 0;
  const kilograms = (Number(liters) || 0) * Number(densityDecimal);
  const total = kilograms * (Number(rate) || 0);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      sellerName: seller,
      liters: Number(liters),
      density: Number(density),
      rate: Number(rate),
      status,
    };
    const res = await api.post('/api/transactions', payload);
    if (res.data && res.data._id) {
      window.open(`/api/transactions/${res.data._id}/pdf`, '_blank');
      setSeller('');
      setLiters('');
      setRate('');
      if (onSaved) onSaved(res.data);
    } else {
      alert('Error saving');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-1  mb-10"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900">New Purchase</h2>

      {/* Seller Name */}
      <div>
        <label className="block text-m font-semibold text-gray-700 mb-2">
          Seller Name
        </label>
        <input
          value={seller}
          onChange={e => setSeller(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Liters */}
      <div>
        <label className="block text-m font-semibold text-gray-700 mb-2">
          Liters
        </label>
        <input
          type="number"
          value={liters}
          onChange={e => setLiters(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Density */}
      <div>
        <label className="block text-m font-semibold text-gray-700 mb-2">
          Density
        </label>
        <select
          value={density}
          onChange={e => setDensity(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none font-semibold"
        >
          {Object.keys(densityMap)
            .sort((a, b) => a - b)
            .map(k => (
              <option key={k} value={k}>
                {k} (decimal: {densityMap[k]})
              </option>
            ))}
        </select>
      </div>

      {/* Rate */}
      <div>
        <label className="block text-m font-semibold text-gray-700 mb-2">
          Rate (Rs)
        </label>
        <input
          type="number"
          value={rate}
          onChange={e => setRate(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Calculations */}
      <div className='font-medium'>
        <p className="text-gray-800 font-semibold">Kg: {kilograms.toFixed(2)}</p>
        <p className="text-gray-800 font-semibold">
          Total: Rs. {total.toFixed(2)}
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-m font-semibold  mb-2">
          Status
        </label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
        >
          <option className='text-red-400 font-semibold'>Not Paid</option>
          <option className='text-green-400 font-semibold'>Paid</option>
        </select>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition mt-1"
      >
        Save & Generate Bill
      </button>
    </form>
  );
}