import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Remove BrowserRouter
import RoleRoute from "./components/RoleRoute";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminMainPage from "./pages/AdminMainPage";
import PlayerMainPage from "./pages/PlayerMainPage";
import LivePage from "./pages/LivePage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage role="player" />} />
      <Route path="/signup-admin" element={<SignupPage role="admin" />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute role="admin">
            <AdminMainPage />
          </RoleRoute>
        }
      />
      <Route
        path="/results"
        element={
          <RoleRoute role="admin">
            <ResultsPage />
          </RoleRoute>
        }
      />

      {/* Player Routes */}
      <Route
        path="/player"
        element={
          <RoleRoute role="player">
            <PlayerMainPage />
          </RoleRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/live"
        element={<LivePage role={localStorage.getItem('userRole')} />}
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
