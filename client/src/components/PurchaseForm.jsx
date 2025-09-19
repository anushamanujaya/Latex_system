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
    <form onSubmit={handleSubmit} 
    className="bg-white/95 backdrop-blur-sm w-full max-w-md space-y-6"
    style={{ 
      padding: '2.5rem', // 40px
      margin: '0 auto',
      maxWidth: 500, 
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}>
      <h2 className='font-extrabold text-center text-2xl'>New Purchase</h2>

      <div>
        <label>Seller Name</label>
        <input value={seller} onChange={e => setSeller(e.target.value)} required />
      </div>

      <div>
        <label>Liters</label>
        <input type="number" value={liters} onChange={e => setLiters(e.target.value)} required />
      </div>

      <div>
        <label>Density</label>
        <select value={density} onChange={e => setDensity(e.target.value)}>
          {Object.keys(densityMap)
            .sort((a, b) => a - b)
            .map(k => (
              <option key={k} value={k}>
                {k} (decimal: {densityMap[k]})
              </option>
            ))}
        </select>
      </div>

      <div>
        <label>Rate (Rs)</label>
        <input type="number" value={rate} onChange={e => setRate(e.target.value)} required />
      </div>

      <div>
        <strong>Kg: {kilograms.toFixed(2)}</strong>
      </div>
      <div>
        <strong>Total: Rs. {total.toFixed(2)}</strong>
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option>Not Paid</option>
          <option>Paid</option>
        </select>
      </div>

      <button type="submit" className='w-full'>Save & Generate Bill</button>
    </form>
  );
}
