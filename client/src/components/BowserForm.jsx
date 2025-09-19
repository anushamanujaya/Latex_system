import { useState } from 'react';
import api from '../utils/axios';

export default function BowserForm({ onSaved }) {
  const [liters, setLiters] = useState('');
  const [kilos, setKilos] = useState('');
  const [amountGiven, setAmountGiven] = useState('');
  const [amountReceived, setAmountReceived] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  // get stock stats first
  const stock = await api.get('/api/marker/profit');
  const profit = amountReceived - stock.data.totalAmount;

  await api.post('/api/bowser', {
    litersGiven: +liters,
    kilosGiven: +kilos,
    amountGiven: stock.data.totalAmount,
    amountReceived: +amountReceived,
    profit
  });

  await api.post('/api/marker'); // ✅ place new marker
  onSaved();
};


  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Liters" value={liters} onChange={e=>setLiters(e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Kilos" value={kilos} onChange={e=>setKilos(e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Amount Given" value={amountGiven} onChange={e=>setAmountGiven(e.target.value)} className="border p-2 w-full"/>
      <input placeholder="Amount Received" value={amountReceived} onChange={e=>setAmountReceived(e.target.value)} className="border p-2 w-full"/>
      <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
