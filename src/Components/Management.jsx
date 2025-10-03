import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ user, onLogout, goToManagement }) {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    collaborations: 0,
    averageRating: 0,
    totalReviews: 0
  });

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1️⃣ Fetch projects
    axios.get(`http://localhost:5000/projects/${user.id}`)
      .then(res => {
        const projectsData = res.data;
        setProjects(projectsData);

        // 2️⃣ Calculate stats from projects
        const total = projectsData.length;
        const active = projectsData.filter(p => p.status === "active").length;
        const completed = projectsData.filter(p => p.status === "completed").length;

        setStats(prev => ({
          ...prev,
          totalProjects: total,
          activeProjects: active,
          completedProjects: completed,
          collaborations: projectsData.reduce((acc, p) => acc + (p.collaborators || 0), 0)
        }));

        // 3️⃣ Generate activities from projects
        const acts = projectsData.map(p => ({
          action: p.status === "completed" ? "Completed" : "Working on",
          project: p.title,
          time: p.lastUpdate || "N/A"
        }));
        setActivities(acts);

        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });

    // 4️⃣ Fetch reviews (if you have backend API)
    axios.get(`http://localhost:5000/reviews/${user.id}`)
      .then(res => {
        const reviewsData = res.data;
        setReviews(reviewsData);
        const avgRating = reviewsData.length
          ? (reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length).toFixed(1)
          : 0;
        setStats(prev => ({ ...prev, averageRating: avgRating, totalReviews: reviewsData.length }));
      })
      .catch(err => console.log("Error fetching reviews:", err));
  }, [user]);

  // Contribution / Completed projects graph (like GitHub)
  const getContributionData = () => {
    const weeks = 12; // show 12 weeks
    const data = [];
    for (let i = 0; i < weeks; i++) {
      data.push(Math.floor(Math.random() * 5)); // 0-4 contributions
    }
    return data;
  };

  const contributionData = getContributionData();

  const getContributionColor = (count) => {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#9be9a8";
    if (count === 2) return "#40c463";
    if (count === 3) return "#30a14e";
    return "#216e39";
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="profile-avatar-small">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>{user?.name}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Stats */}
          <div className="stats-section">
            <div className="stat-card"><div className="stat-icon projects">📁</div><div className="stat-info"><h3>{stats.totalProjects}</h3><p>Total Projects</p></div></div>
            <div className="stat-card"><div className="stat-icon active">⚡</div><div className="stat-info"><h3>{stats.activeProjects}</h3><p>Active</p></div></div>
            <div className="stat-card"><div className="stat-icon completed">✓</div><div className="stat-info"><h3>{stats.completedProjects}</h3><p>Completed</p></div></div>
            <div className="stat-card"><div className="stat-icon rating">⭐</div><div className="stat-info"><h3>{stats.averageRating}</h3><p>{stats.totalReviews} Reviews</p></div></div>
          </div>

          {/* Contribution Graph */}
          <div className="section-card">
            <h2 className="section-title">Completed Projects (Graph)</h2>
            <div className="contribution-grid">
              {contributionData.map((val, i) => (
                <div key={i} className="contribution-day" style={{ backgroundColor: getContributionColor(val), margin: '2px', width: '20px', height: '20px', display: 'inline-block' }} title={`${val} completed`}></div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="section-card">
            <h2 className="section-title">Your Projects</h2>
            <div className="projects-list">
              {projects.map((p) => (
                <div key={p.id} className="project-card-new">
                  <div className="project-header-new">
                    <div>
                      <h3>{p.title}</h3>
                      <p className="project-description-new">{p.description || "No description"}</p>
                    </div>
                    <span className={`status-badge-new ${p.status}`}>{p.status === "active" ? "🟢 Active" : "✅ Completed"}</span>
                  </div>
                  <div className="project-footer-new">
                    <span>👥 {p.collaborators || 0} collaborators</span>
                    <span>🕒 Updated {p.lastUpdate || "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Activities */}
          <div className="section-card">
            <h2 className="section-title">Recent Activity</h2>
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <p><strong>{a.action}</strong> {a.project}</p>
                  <span className="activity-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="section-card">
            <h2 className="section-title">Recent Reviews</h2>
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <h4>{r.reviewer}</h4>
                <div className="stars">{"⭐".repeat(r.rating)}</div>
                <p>{r.comment}</p>
                <span>On: {r.project}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
