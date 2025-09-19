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
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-8xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reports</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={run}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Run
        </button>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="mb-6 bg-gray-50 p-5 rounded-xl border">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <p><strong>Total Liters:</strong> {summary.totalLiters}</p>
            <p><strong>Total Kilograms:</strong> {summary.totalKilograms?.toFixed(2)}</p>
            <p><strong>Total Money Paid:</strong> Rs. {summary.totalMoneyPaid?.toFixed(2)}</p>
            <p><strong>All Transaction Sum:</strong> Rs. {summary.totalAmountAll?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <h3 className="text-lg font-bold mb-3 text-gray-800">Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-[#8EC93B] text-black text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Liters</th>
              <th className="p-3">Kilograms</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-3 border-b">{t.sellerName}</td>
                <td className="p-3 border-b">{t.liters}</td>
                <td className="p-3 border-b">{t.kilograms?.toFixed(2) || '-'}</td>
                <td className="p-3 border-b">Rs. {t.totalAmount.toFixed(2)}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      t.status.toLowerCase() === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}