import  { useState } from "react";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Management from "./Components/Management.jsx";
import Collaboration from "./Components/Collaboration.jsx";
import Analytics from "./Components/Analytics.jsx";
import Profile from "./Components/Profile.jsx";
import "./App.css";

// Define User type
type User = {
  id: number;
  name: string;
  email: string;
};

type Page =
  | "login"
  | "register"
  | "dashboard"
  | "management"
  | "collaboration"
  | "analytics"
  | "profile";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // When login is successful
  const handleLoginSuccess = (userData: User) => {
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

  // Go to any page from Dashboard
  const goToPage = (pageName: Page) => {
    setCurrentPage(pageName);
  };

  return (
    <>
      {currentPage === "login" && (
        <Login
          onRegisterClick={showRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === "register" && <Register onRegisterClick={showLogin} />}

      {currentPage === "dashboard" && loggedInUser && (
        <Dashboard
          user={loggedInUser}
          onLogout={handleLogout}
          goToManagement={() => setCurrentPage("management")}
          goToPage={goToPage}
        />
      )}

      {currentPage === "management" && loggedInUser && (
        <Management user={loggedInUser} onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "collaboration" && (
        <Collaboration onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "analytics" && (
        <Analytics onBack={() => setCurrentPage("dashboard")} />
      )}

      {currentPage === "profile" && (
        <Profile onBack={() => setCurrentPage("dashboard")} />
      )}
    </>
  );
}

export default App;
