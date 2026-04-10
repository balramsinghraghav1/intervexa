import { useState, useEffect, useRef } from "react";
import axios from "axios";

const VoiceInterview = ({ sessionId }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [status, setStatus] = useState("Click mic to start");
  const recognitionRef = useRef(null);

  // ── Setup Speech Recognition ──────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("❌ Browser doesn't support speech recognition. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setIsListening(false);
      await sendToInterview(spokenText);
    };

    recognition.onerror = (e) => {
      setStatus(`Error: ${e.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  // ── Send user speech to backend → Claude ─────────────────
  const sendToInterview = async (userText) => {
    try {
      setStatus("🤔 Claude is thinking...");
      const { data } = await axios.post(
        `/api/interview/${sessionId}/message`,
        { message: userText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAiReply(data.reply);
      speak(data.reply);
    } catch (err) {
      setStatus("❌ Error contacting server");
      console.error(err);
    }
  };

  // ── Text-to-Speech ────────────────────────────────────────
  const speak = (text) => {
    window.speechSynthesis.cancel(); // stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google") || v.name.includes("Natural")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus("🔊 Interviewer is speaking...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus("🎤 Your turn — click mic to answer");
    };

    window.speechSynthesis.speak(utterance);
  };

  // ── Start Listening ───────────────────────────────────────
  const startListening = () => {
    if (!recognitionRef.current || isSpeaking) return;
    window.speechSynthesis.cancel();
    setTranscript("");
    setStatus("🎤 Listening...");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── UI ────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <p style={styles.status}>{status}</p>

      {/* Mic Button */}
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        disabled={isSpeaking}
        style={{
          ...styles.micBtn,
          background: isListening ? "#ef4444" : "#6366f1",
          transform: isListening ? "scale(1.1)" : "scale(1)",
        }}
      >
        {isListening ? "🔴 Listening..." : "🎤 Hold to Speak"}
      </button>

      {/* Transcript */}
      {transcript && (
        <div style={styles.box}>
          <strong>You said:</strong>
          <p>{transcript}</p>
        </div>
      )}

      {/* Claude's reply */}
      {aiReply && (
        <div style={{ ...styles.box, borderColor: "#6366f1" }}>
          <strong>Interviewer:</strong>
          <p>{aiReply}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  status: {
    fontSize: "1rem",
    color: "#555",
    fontStyle: "italic",
  },
  micBtn: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  box: {
    width: "100%",
    maxWidth: "500px",
    padding: "1rem",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    background: "#f9fafb",
  },
};

export default VoiceInterview;