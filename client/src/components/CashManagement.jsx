import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

export default function CashManagement() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [brought, setBrought] = useState('');
  const [paid, setPaid] = useState(0);
  const [kilograms, setKilograms] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await api.get('/api/reports/summary', { params: { date } });
      setPaid(res.data.totalMoneyPaid || 0);
      setKilograms(res.data.totalKilograms || 0);
    };
    fetchSummary();
  }, [date]);

  const submit = async () => {
    const res = await api.post('/api/cash', {
      date,
      broughtFromBank: Number(brought),
      paidToSellers: Number(paid),
    });
    setResult(res.data);
  };

  return (
    <div className="card" style={{ maxWidth: 500 }}>
      <h2>Cash Management</h2>

      <label>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <label>Brought From Bank</label>
      <input type="number" value={brought} onChange={e => setBrought(e.target.value)} />

      <label>Paid To Sellers (auto)</label>
      <input type="number" value={paid} readOnly style={{ background: '#f3f4f6' }} />

      <label>Total Kilograms (for day)</label>
      <input type="number" value={kilograms.toFixed(2)} readOnly style={{ background: '#f3f4f6' }} />

      <button onClick={submit} style={{ marginTop: '10px' }}>Save</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Summary</h3>
          <p><strong>Brought From Bank:</strong> Rs. {result.broughtFromBank}</p>
          <p><strong>Paid To Sellers:</strong> Rs. {result.paidToSellers}</p>
          <p><strong>Money Left (Remaining):</strong> Rs. {result.moneyLeft}</p>
          <p><strong>Borrowed:</strong> Rs. {result.borrowed}</p>
        </div>
      )}
    </div>
  );
}
