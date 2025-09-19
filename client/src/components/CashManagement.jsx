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

  const cardStyle = {
    maxWidth: '500px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    background: '#ffffff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const labelStyle = {
    display: 'block',
    marginTop: '15px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '14px',
  };

  const readonlyStyle = {
    ...inputStyle,
    background: '#f3f4f6',
    cursor: 'not-allowed',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '12px',
    width: '100%',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const summaryBox = {
    marginTop: '25px',
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  };

  return (

<div className='mt-25 mb-25'>

    <div style={cardStyle}>
      <h2 style={{ textAlign: 'center', color: '#2563eb' }}>💰 Cash Management</h2>

      <label style={labelStyle}>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Brought From Bank</label>
      <input type="number" value={brought} onChange={e => setBrought(e.target.value)} style={inputStyle} />

      <label style={labelStyle}>Paid To Sellers (auto)</label>
      <input type="number" value={paid} readOnly style={readonlyStyle} />

      <label style={labelStyle}>Total Kilograms (for day)</label>
      <input type="number" value={kilograms.toFixed(2)} readOnly style={readonlyStyle} />

      <button onClick={submit} style={buttonStyle}>Save</button>

      {result && (
        <div style={summaryBox}>
          <h3 style={{ marginBottom: '10px', color: '#111' }}>📊 Summary</h3>
          <p><strong>Brought From Bank:</strong> Rs. {result.broughtFromBank}</p>
          <p><strong>Paid To Sellers:</strong> Rs. {result.paidToSellers}</p>
          <p><strong>Money Left (Remaining):</strong> Rs. {result.moneyLeft}</p>
          <p><strong>Borrowed:</strong> Rs. {result.borrowed}</p>
        </div>
      )}
    </div>
</div>
  );
}
