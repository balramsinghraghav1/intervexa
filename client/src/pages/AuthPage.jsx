import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode }) => {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { persist } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = isLogin ? await api.login(form) : await api.register(form);
      persist(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">{isLogin ? "Welcome back" : "Join Intervexa"}</p>
        <h1>{isLogin ? "Login to continue practice." : "Create your interview workspace."}</h1>

        {!isLogin && (
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Enter your name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="student@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter password"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button full-width" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
        </button>

        <p className="muted-text">
          {isLogin ? "Need an account?" : "Already registered?"}{" "}
          <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Register" : "Login"}</Link>
        </p>
      </form>
    </main>
  );
};

export default AuthPage;
