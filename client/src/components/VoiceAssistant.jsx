import React, { useState } from "react";
import api from "../utils/axios";
import VoiceRecorder from "./VoiceRecorder";

export default function VoiceAssistant() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = async (text) => {
    setLoading(true);
    setStatus("🧠 Processing your command...");

    try {
      // Step 1: Send free text to AI parser
      const res = await api.post("/api/ai/parsePurchase", { text });
      const data = res.data;

      // Step 2: Save purchase using existing /transactions API
      const purchaseRes = await api.post("/api/transactions", {
        sellerName: data.sellerName,
        liters: Number(data.liters),
        density: Number(data.density),
        rate: Number(data.rate),
        status: data.status || "Not Paid",
      });

      setStatus(`✅ Purchase saved for Seller: ${purchaseRes.data.sellerName}`);
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Failed to process voice command");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-center">🎤 AI Voice Assistant</h2>

      {/* Voice Input Button */}
      <VoiceRecorder onResult={handleVoiceInput} />

      {/* Status Message */}
      {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
      {status && <p className="text-green-700 font-semibold">{status}</p>}
    </div>
  );
}