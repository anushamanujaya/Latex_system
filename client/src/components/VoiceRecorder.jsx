import React from "react";

export default function VoiceRecorder({ onResult }) {
  const handleRecord = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("⚠️ Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Transcript:", transcript);
      onResult(transcript); // send to parent
    };

    recognition.onerror = (err) => {
      console.error("Recognition error:", err);
      alert("⚠️ Voice recognition failed");
    };
  };

  return (
    <button
      onClick={handleRecord}
      className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-2 rounded-lg"
    >
      🎤 Speak Command
    </button>
  );
}