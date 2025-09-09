import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

export default function TransactionsList() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await api.get('/api/transactions');
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Seller</th>
            <th>Liters</th>
            <th>Kilograms</th>
            <th>Total</th>
            <th>Status</th>
            <th>Bill</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it._id}>
              <td>{new Date(it.createdAt).toLocaleString()}</td>
              <td>{it.sellerName}</td>
              <td>{it.liters}</td>
              <td>{it.kilograms?.toFixed(2) || '-'}</td>
              <td>Rs. {it.totalAmount.toFixed(2)}</td>
              <td>{it.status}</td>
              <td>
                <a href={`/api/transactions/${it._id}/pdf`} target="_blank" rel="noreferrer">
                  PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
