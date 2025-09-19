import { useEffect, useState } from 'react';
import api from '../utils/axios';
import BowserForm from '../components/BowserForm';
import BowserCharts from '../components/BowserCharts';

export default function Bowser() {
  const [records, setRecords] = useState([]);

  const load = async () => {
    const res = await api.get('/api/bowser');
    setRecords(res.data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bowser Profit Tracker</h1>
      <BowserForm onSaved={() => load()} />
      <BowserCharts records={records} />
    </div>
  );
}
