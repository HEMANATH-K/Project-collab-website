import React, { useState } from "react";
import "./Login.css";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register({ onRegisterClick }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      // Go to login page after successful registration
      onRegisterClick();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        <p className="login-link">
          Already have an account?{" "}
          <button type="button" onClick={onRegisterClick} className="link-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
