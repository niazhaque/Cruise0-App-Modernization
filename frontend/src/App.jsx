import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./index.css";

export default function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  // Redirect to dashboard after login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container">
            <img src="/cruise-logo.png" className="logo" />
            <h1 className="title">Welcome Aboard.</h1>
            <p className="subtitle">Log in to book your journey with Cruise0.</p>

            <button className="btn" onClick={() => loginWithRedirect()}>
              Login
            </button>
          </div>
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
