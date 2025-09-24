import React, { useState } from "react";
import PurchaseForm from "../components/PurchaseForm";
import VoiceAssistant from "../components/VoiceAssistant";
import { Mic } from "lucide-react"; // ✅ Using lucide-react icon (already in your package.json)

export default function PurchasePage() {
  const [showVoice, setShowVoice] = useState(false);

  return (
    <div className="relative space-y-10 px-4">
      {/* Manual entry */}
      <PurchaseForm />

      {/* ✅ Floating mic button bottom-right of the page */}
      <button
        onClick={() => setShowVoice(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition"
      >
        <Mic size={28} />
      </button>

      {/* ✅ Modal with VoiceAssistant */}
      {showVoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowVoice(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <VoiceAssistant />
          </div>
        </div>
      )}
    </div>
  );
}