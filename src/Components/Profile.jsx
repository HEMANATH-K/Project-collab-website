import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile({ onBack, userId }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from backend
  useEffect(() => {
    axios.get(`http://localhost:5000/users/${userId}`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/users/${userId}`, profile)
      .then(res => {
        alert("✅ Profile updated successfully!");
        setEditing(false);
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to update profile.");
      });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>Profile / Settings</h1>
      </div>

      <div className="profile-card">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          readOnly={!editing}
        />

        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={profile.role}
          onChange={handleChange}
          readOnly={!editing}
        />

        {editing ? (
          <div className="profile-buttons">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}
