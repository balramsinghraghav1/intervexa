import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <Suspense fallback={<div className="center-panel">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
