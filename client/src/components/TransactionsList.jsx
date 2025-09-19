import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

export default function TransactionsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/api/transactions');
      setItems(res.data);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Recent Latex Transactions
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-x-auto ">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
            <thead className='px-10'>
              <tr className="bg-[#8EC93B] text-left text-black h-17 text-l font-extrabold">
                <th className="p-3">Date</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Liters</th>
                <th className="p-3">Kilograms</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bill</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{new Date(it.createdAt).toLocaleString()}</td>
                  <td className="p-3 border-b">{it.sellerName}</td>
                  <td className="p-3 border-b">{it.liters}</td>
                  <td className="p-3 border-b">{it.kilograms?.toFixed(2) || '-'}</td>
                  <td className="p-3 border-b">Rs. {it.totalAmount.toFixed(2)}</td>
                  <td className="p-3 border-b">
                    <select
                      value={it.status}
                      onChange={async (e) => {
                        try {
                          const newStatus = e.target.value;
                          await api.put(`/api/transactions/${it._id}/status`, { status: newStatus });
                          load();
                        } catch (err) {
                          console.error('Error updating status:', err);
                          alert('Failed to update status');
                        }
                      }}
                      className={`px-3 py-1 rounded-md border text-sm font-medium focus:outline-none ${
                        it.status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Not Paid">Not Paid</option>
                    </select>
                  </td>
                  <td className="p-3 border-b">
                    <a
                      href={`/api/transactions/${it._id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}