import { Link } from "react-router-dom";

const features = [
  "Practice DSA, Operating Systems, and Computer Networks",
  "Get AI-style feedback and weighted scoring out of 20",
  "Track streaks, history, and recent performance visually"
];

const LandingPage = () => {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          {/* <p className="eyebrow">Synopsis to product</p> */}
          <h1>Build confidence before the real technical interview begins.</h1>
          <p className="hero-text">
            Intervexa turns your project idea into a polished interview practice platform with
            subject-wise mock rounds, scoring, streaks, and progress analytics.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/register">
              Create account
            </Link>
            <Link className="ghost-button" to="/login">
              Try demo flow
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="score-chip">Score normalized to 20</div>
          <h2>Interview flow</h2>
          <ol>
            <li>Select a subject</li>
            <li>Answer 9 questions by difficulty pattern</li>
            <li>Review AI feedback and track your streak</li>
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

