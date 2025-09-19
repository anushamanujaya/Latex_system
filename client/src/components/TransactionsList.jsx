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
      <h2 className="text-2xl font-bold text-center bg-white relative top-[6px]"> Recent Latex Transactions </h2>

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
        <div className="overflow-x-auto">
          {/* Desktop table */}
          <table className="hidden md:table w-full table-auto border-collapse">
            <thead>
              <tr className="bg-white text-left">
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Seller</th>
                <th className="p-3 border-b">Liters</th>
                <th className="p-3 border-b">Kilograms</th>
                <th className="p-3 border-b">Total</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Bill</th>
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
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        it.status.toLowerCase() === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {it.status.charAt(0).toUpperCase() + it.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <a
                      href={`/api/transactions/${it._id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile-friendly stacked layout */}
          <div className="md:hidden space-y-4">
            {items.map((it) => (
              <div key={it._id} className="border rounded p-4 shadow-sm">
                <div className="mb-2 text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
                <div><strong>Seller:</strong> {it.sellerName}</div>
                <div><strong>Liters:</strong> {it.liters}</div>
                <div><strong>Kilograms:</strong> {it.kilograms?.toFixed(2) || '-'}</div>
                <div><strong>Total:</strong> Rs. {it.totalAmount.toFixed(2)}</div>
                <div>
                  <strong>Status:</strong>{' '}
                  

                </div>
                <div className="mt-2">
                  <a
                    href={`/api/transactions/${it._id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
