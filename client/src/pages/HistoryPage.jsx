import { useEffect, useState } from "react";
import { api } from "../api";

const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.history();
        setSessions(response.sessions);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  if (error) {
    return <main className="page-shell center-panel">{error}</main>;
  }

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Practice history</p>
        <h1>Review your completed interview sessions</h1>
      </section>

      <section className="history-list">
        {sessions.length === 0 && <article className="panel">No completed sessions yet.</article>}

        {sessions.map((session) => (
          <article className="panel history-card" key={session._id}>
            <div>
              <p className="eyebrow">{session.subject}</p>
              <h3>{session.totalScore}/20 score</h3>
            </div>
            <p className="muted-text">
              {new Date(session.completedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
              })}
            </p>
            <p>{session.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HistoryPage;

