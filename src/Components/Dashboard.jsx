import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ user, onLogout, goToManagement, goToPage }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/projects/${user.id}`)
        .then((res) => {
          setProjects(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="profile-avatar-small">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user?.name}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="quick-actions">
            <button className="action-btn primary" onClick={goToManagement}>
              Project Management
            </button>
            <button
              className="action-btn secondary"
              onClick={() => goToPage("collaboration")}
            >
              Collaboration / Invitations
            </button>
            <button
              className="action-btn secondary"
              onClick={() => goToPage("analytics")}
            >
              Analytics / Reports
            </button>
            <button
              className="action-btn secondary"
              onClick={() => goToPage("profile")}
            >
              Profile / Settings
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <h2>Your Projects</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <ul className="project-list">
              {projects.map((project) => (
                <li key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>Project ID: {project.id}</p>
                  <p>Status: {project.status || "Active"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
