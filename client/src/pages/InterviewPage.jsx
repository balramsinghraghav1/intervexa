import { useEffect, useMemo, useRef, useState } from "react";
import { api, createAudioUrl } from "../api";

const subjects = ["DSA", "CN", "OS", "DBMS"];

const InterviewPage = () => {
  const [subject, setSubject] = useState("DSA");
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("Select a subject and press start.");
  const [audioUrl, setAudioUrl] = useState(null);
  const [spokenText, setSpokenText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const progressText = useMemo(() => {
    if (!currentQuestion) {
      return "3 easy · 4 medium · 3 hard";
    }

    return `Question ${currentQuestion.index + 1} of ${currentQuestion.total}`;
  }, [currentQuestion]);

  useEffect(() => {
    if (isMuted) {
      return undefined;
    }

    let audio;

    if (audioUrl) {
      audio = new Audio(audioUrl);
      audio.play().catch(() => {
        if ("speechSynthesis" in window && spokenText) {
          const utterance = new SpeechSynthesisUtterance(spokenText);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      });
    } else if ("speechSynthesis" in window && spokenText) {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (audio) {
        audio.pause();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, isMuted, spokenText]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startInterview = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setSpokenTranscript("");
    setRecordedBlob(null);

    try {
      const response = await api.startInterview({ subject });
      setSessionId(response.sessionId);
      setCurrentQuestion(response.question);
      setStatusMessage("AI is asking the question. Listen, then record your answer.");
      setAudioUrl(createAudioUrl(response.audioBase64));
      setSpokenText(response.spokenText || response.question?.prompt || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        throw new Error("This browser does not support microphone recording.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setRecordedBlob(blob);
        setRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      setStatusMessage("Recording... speak your answer clearly, then stop recording.");
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const submitAnswer = async () => {
    if (!recordedBlob || !sessionId) {
      setError("Please record your answer first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.submitAnswer(sessionId, recordedBlob);
      setSpokenTranscript(response.transcript || "");
      setRecordedBlob(null);
      setAudioUrl(createAudioUrl(response.audioBase64));
      setSpokenText(response.spokenText || response.question?.prompt || "");

      if (response.status === "completed") {
        setResult(response);
        setCurrentQuestion(null);
        setStatusMessage("Interview complete. Your final score is ready.");
      } else {
        setCurrentQuestion(response.question);
        setStatusMessage(`Saved ${response.savedMarks} mark(s). AI moved to the next question.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Interview simulator</p>
        <h1>Practice a full voice-to-voice round</h1>
        <p className="muted-text">{progressText}</p>

        <div className="subject-picker">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              className={item === subject ? "subject-button active" : "subject-button"}
              onClick={() => setSubject(item)}
              disabled={Boolean(sessionId && !result)}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            className={isMuted ? "subject-button mute-toggle active" : "subject-button mute-toggle"}
            onClick={() => setIsMuted((value) => !value)}
          >
            {isMuted ? "Unmute AI" : "Mute AI"}
          </button>
        </div>

        {!sessionId && (
          <button className="start-circle" type="button" onClick={startInterview} disabled={loading}>
            <span>Start</span>
          </button>
        )}

        <p className="muted-text">{statusMessage}</p>
      </section>

      {error && <section className="panel form-error">{error}</section>}

      {currentQuestion && !result && (
        <section className="question-list">
          <article className="panel question-card">
            <div className="question-head">
              <span>Q{currentQuestion.index + 1}</span>
              <span className={`difficulty-badge ${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <h3>{currentQuestion.prompt}</h3>
            <p className="muted-text">
              The AI asks this aloud unless muted. Record your spoken answer only once.
            </p>

            <div className="voice-controls">
              {!recording ? (
                <button className="primary-button" type="button" onClick={startRecording} disabled={loading}>
                  Record answer
                </button>
              ) : (
                <button className="ghost-button" type="button" onClick={stopRecording}>
                  Stop recording
                </button>
              )}

              <button
                className="primary-button"
                type="button"
                onClick={submitAnswer}
                disabled={loading || recording || !recordedBlob}
              >
                {loading ? "Submitting answer..." : "Submit voice answer"}
              </button>
            </div>

            {spokenTranscript && (
              <div className="transcript-box">
                <p className="eyebrow">Last transcript</p>
                <p>{spokenTranscript}</p>
              </div>
            )}
          </article>
        </section>
      )}

      {result?.session && (
        <section className="question-list">
          <article className="panel result-hero">
            <p className="eyebrow">Interview result</p>
            <h2>{result.session.totalScore}/20</h2>
            <p>{result.session.summary}</p>
            <p className="muted-text">Current streak: {result.streak?.current || 0} day(s)</p>
          </article>

          {result.session.questions.map((question, index) => (
            <article className="panel question-card" key={`${question.prompt}-${index}`}>
              <div className="question-head">
                <span>Q{index + 1}</span>
                <span className={`difficulty-badge ${question.difficulty}`}>{question.difficulty}</span>
              </div>
              <h3>{question.prompt}</h3>
              <p className="answer-copy">{question.answer}</p>
              <p className="feedback-copy">Saved marks: {question.awardedRawScore}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default InterviewPage;
