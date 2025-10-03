import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Collaboration.css";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Collaboration({ onBack, userId }) {
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch invitations (sample API, replace with real backend)
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/collaborations/${userId}`)
      .then((res) => setInvitations(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  // Handle search & match
  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const skillsArray = search.split(",").map((s) => s.trim());
      const res = await axios.post(`${API_BASE_URL}/match-projects`, {
        skills: skillsArray,
      });
      setMatches(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collab-container">
      <div className="collab-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h1>Collaboration / Invitations</h1>
      </div>

      {/* Search for projects */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter skills e.g. React, Node.js"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Show matches */}
      {loading && <p>Loading matches...</p>}
      {!loading && matches.length > 0 && (
        <div className="collab-grid">
          {matches.map((project) => (
            <div key={project.id} className="collab-card">
              <h3>{project.name}</h3>
              <p>Technologies: {project.technologies}</p>
              <div className="match-bar">
                <div
                  className="match-fill"
                  style={{ width: `${project.similarity * 100}%` }}
                />
              </div>
              <p>Match: {(project.similarity * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Invitations */}
      <div className="collab-section">
        <h2>Invitations</h2>
        {invitations.length === 0 ? (
          <p>No invitations at the moment</p>
        ) : (
          <div className="collab-grid">
            {invitations.map((inv, idx) => (
              <div key={idx} className="collab-card">
                <h3>{inv.project}</h3>
                <p>From: {inv.invited_by}</p>
                <p>
                  Status: <strong>{inv.status}</strong>
                </p>
                {inv.status === "Pending" && (
                  <div className="collab-actions">
                    <button className="accept-btn">Accept</button>
                    <button className="reject-btn">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
