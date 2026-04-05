import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">I</span>
        <div>
          <strong>Intervexa</strong>
          <small>AI Interview Practice</small>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/interview">Interview</NavLink>}
        {user && <NavLink to="/history">History</NavLink>}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-pill">{user.name}</span>
            <button
              className="ghost-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

