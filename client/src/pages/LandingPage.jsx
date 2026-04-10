import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  "Practice DSA, Operating Systems, Computer Networks, and DBMS",
  "Run voice-to-voice interviews with Groq-powered speech flow",
  "Track streaks, history, and recent performance visually"
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <h1>Build confidence before the real technical interview begins.</h1>
          <p className="hero-text">
            Intervexa gives you a voice interview simulator where the AI asks questions, listens
            to your spoken answers, saves marks silently, and moves to the next round like a real
            interviewer.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link className="primary-button" to="/interview">
                  Start interview
                </Link>
                <Link className="ghost-button" to="/dashboard">
                  Open dashboard
                </Link>
              </>
            ) : (
              <>
                <Link className="primary-button" to="/register">
                  Create account
                </Link>
                <Link className="ghost-button" to="/login">
                  Try demo flow
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-panel">
          <div className="score-chip">Total score 20 marks</div>
          <h2>Interview flow</h2>
          <ol>
            <li>Select a subject</li>
            <li>Press the big start circle and answer 10 spoken questions</li>
            <li>Review your final marks and track your streak</li>
          </ol>
        </div>
      </section>

      <section className="feature-grid">
        {features.map((feature) => (
          <article key={feature} className="feature-card">
            <h3>{feature}</h3>
          </article>
        ))}
      </section>
    </main>
  );
};

export default LandingPage;
