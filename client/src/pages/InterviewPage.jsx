import { useState } from "react";
import { api } from "../api";

const subjects = ["DSA", "OS", "CN"];

const InterviewPage = () => {
  const [subject, setSubject] = useState("DSA");
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startInterview = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.startInterview({ subject });
      setSession(response.session);
      setAnswers(new Array(response.session.questions.length).fill(""));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.submitInterview(session._id, { answers });
      setResult(response);
      setSession(response.session);
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
        <h1>Practice a full AI-style round</h1>
        <p className="muted-text">
          Each round contains 3 easy, 4 medium, and 2 hard questions.
        </p>

        <div className="subject-picker">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              className={item === subject ? "subject-button active" : "subject-button"}
              onClick={() => setSubject(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {!session?.questions && (
          <button className="primary-button" type="button" onClick={startInterview} disabled={loading}>
            {loading ? "Generating questions..." : `Start ${subject} interview`}
          </button>
        )}
      </section>

      {error && <section className="panel form-error">{error}</section>}

      {session?.questions && !result && (
        <section className="question-list">
          {session.questions.map((question, index) => (
            <article className="panel question-card" key={`${question.prompt}-${index}`}>
              <div className="question-head">
                <span>Q{index + 1}</span>
                <span className={`difficulty-badge ${question.difficulty}`}>{question.difficulty}</span>
              </div>
              <h3>{question.prompt}</h3>
              <textarea
                rows="5"
                value={answers[index]}
                onChange={(event) => {
                  const next = [...answers];
                  next[index] = event.target.value;
                  setAnswers(next);
                }}
                placeholder="Write your interview answer here..."
              />
            </article>
          ))}

          <button className="primary-button" type="button" onClick={submitInterview} disabled={loading}>
            {loading ? "Evaluating answers..." : "Submit interview"}
          </button>
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
              <p className="feedback-copy">{question.feedback}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default InterviewPage;

