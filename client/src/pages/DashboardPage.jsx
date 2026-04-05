import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.overview();
        setData(response);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  if (error) {
    return <main className="page-shell center-panel">{error}</main>;
  }

  if (!data) {
    return <main className="page-shell center-panel">Loading dashboard...</main>;
  }

  return (
    <main className="page-shell">
      <section className="dashboard-grid">
        <StatCard label="Total sessions" value={data.stats.totalSessions} />
        <StatCard label="Average score" value={`${data.stats.averageScore}/20`} tone="warm" />
        <StatCard label="Current streak" value={`${data.stats.currentStreak} day`} />
        <StatCard label="Longest streak" value={`${data.stats.longestStreak} day`} tone="cool" />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Recent activity</p>
            <h2>Interview performance trend</h2>
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.activity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#ff7a18" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="subject-grid">
        {data.subjectBreakdown.map((item) => (
          <article className="panel" key={item.subject}>
            <p className="eyebrow">{item.subject}</p>
            <h3>{item.averageScore}/20 average</h3>
            <p className="muted-text">{item.sessions} completed interview sessions</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default DashboardPage;

