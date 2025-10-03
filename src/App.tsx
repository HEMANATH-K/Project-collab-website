import React, { useState } from "react";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Management from "./Components/Management.jsx";
import Collaboration from "./Components/Collaboration.jsx";
import Analytics from "./Components/Analytics.jsx";
import Profile from "./Components/Profile.jsx";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // login, register, dashboard, management, collaboration, analytics, profile
  const [loggedInUser, setLoggedInUser] = useState(null);

  // When login is successful
  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    setCurrentPage("dashboard");
  };

  // Show register page
  const showRegister = () => setCurrentPage("register");

  // Show login page
  const showLogin = () => setCurrentPage("login");

  // Logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage("login");
  };

  // **Go to any page from Dashboard**
  const goToPage = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <>
      {/* Login Page */}
      {currentPage === "login" && (
        <Login 
          onRegisterClick={showRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Register Page */}
      {currentPage === "register" && (
        <Register onRegisterClick={showLogin} />
      )}

      {/* Dashboard Page */}
      {currentPage === "dashboard" && (
        <Dashboard 
          user={loggedInUser}
          onLogout={handleLogout}
          goToManagement={() => setCurrentPage("management")}
          goToPage={goToPage} // pass this so Dashboard buttons work
        />
      )}

      {/* Project Management Page */}
      {currentPage === "management" && (
        <Management 
          user={loggedInUser}
          onBack={() => setCurrentPage("dashboard")}
        />
      )}

      {/* Collaboration / Invitations Page */}
      {currentPage === "collaboration" && (
        <Collaboration onBack={() => setCurrentPage("dashboard")} />
      )}

      {/* Analytics / Reports Page */}
      {currentPage === "analytics" && (
        <Analytics onBack={() => setCurrentPage("dashboard")} />
      )}

      {/* Profile / Settings Page */}
      {currentPage === "profile" && (
        <Profile onBack={() => setCurrentPage("dashboard")} />
      )}
    </>
  );
}

export default App;
