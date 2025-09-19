import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function BowserCharts({ records }) {
  if (!records.length) return <p>No records yet.</p>;

  const latest = records[records.length - 1];

  const pieData = [
    { name: 'Amount Given', value: latest.amountGiven },
    { name: 'Profit', value: latest.profit }
  ];
  const COLORS = ['#8884d8', '#82ca9d'];

  const lineData = records.map(r => ({
    date: new Date(r.date).toLocaleDateString(),
    profit: r.profit
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Latest Profit Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Profit History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
