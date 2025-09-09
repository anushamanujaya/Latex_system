import React, { useState } from 'react';
import api from '../utils/axios';

export default function Reports() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const run = async () => {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const [sumRes, txRes] = await Promise.all([
      api.get('/api/reports/summary', { params }),
      api.get('/api/transactions', { params }),
    ]);
    setSummary(sumRes.data);
    setTransactions(txRes.data);
  };

  return (
    <div className="card">
      <h2>Reports</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>Start Date</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={run}>Run</button>
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Summary</h3>
          <p><strong>Total Liters:</strong> {summary.totalLiters}</p>
          <p><strong>Total Kilograms:</strong> {summary.totalKilograms}</p>
          <p><strong>Total Money Paid:</strong> Rs. {summary.totalMoneyPaid}</p>
          <p><strong>All Transaction Sum:</strong> Rs. {summary.totalAmountAll}</p>
        </div>
      )}

      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Seller</th>
            <th>Liters</th>
            <th>Kilograms</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t._id}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>{t.sellerName}</td>
              <td>{t.liters}</td>
              <td>{t.kilograms?.toFixed(2) || '-'}</td>
              <td>Rs. {t.totalAmount.toFixed(2)}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
