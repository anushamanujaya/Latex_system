import { useEffect, useState } from "react";
import api from "../utils/axios";
import BowserForm from "../components/BowserForm";
import BowserCharts from "../components/BowserCharts";

export default function Bowser() {
  const [records, setRecords] = useState([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await api.get("/api/bowser");
    setRecords(res.data);
  };

  useEffect(() => { load(); }, []);

  const askForecast = async () => {
    if (!aiQuestion.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/ai/profit/forecast", { text: aiQuestion });
      setAiAnswer(res.data);
    } catch (err) {
      console.error("Forecast failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BowserForm onSaved={() => load()} />
      <BowserCharts records={records} />

      {/* AI Profit Forecast Section */}
      <div className="bg-purple-50 rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-3">🔮 Profit Forecast Assistant</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder='e.g. "If I sell 1000 liters at Rs.340/kg what is profit?"'
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring focus:ring-purple-400 focus:border-purple-500 outline-none"
          />
          <button
            onClick={askForecast}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Ask
          </button>
        </div>
        {loading && <p className="text-sm text-gray-500 mt-3">Calculating forecast...</p>}
        {aiAnswer && (
          <div className="mt-4 bg-white rounded-md p-3 border">
            <p><strong>Question:</strong> {aiAnswer.query}</p>

            {aiAnswer.forecast?.profit !== undefined ? (
              <>
                <p><strong>Estimated Kilograms:</strong> {aiAnswer.forecast.kilos?.toFixed(2)} kg</p>
                <p><strong>Estimated Cost:</strong> Rs {aiAnswer.forecast.cost?.toFixed(2) || 0}</p>
                <p><strong>Revenue (at rate {aiAnswer.forecast.rate}):</strong> Rs {aiAnswer.forecast.revenue?.toFixed(2) || 0}</p>
                <p><strong>Projected Profit:</strong> Rs {aiAnswer.forecast.profit?.toFixed(2) || 0}</p>
              </>
            ) : (
                <p><em>No valid forecast returned.</em></p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}