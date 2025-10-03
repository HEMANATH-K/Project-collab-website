import React, { useState } from "react";
import "./Login.css";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login({ onRegisterClick, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);

      // Pass user data to parent (App.jsx)
      onLoginSuccess(data.user);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account?{" "}
          <button type="button" onClick={onRegisterClick} className="link-btn">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
