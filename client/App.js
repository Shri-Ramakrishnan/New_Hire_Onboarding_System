import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminManage from "./pages/AdminManage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import UserSteps from "./pages/UserSteps.jsx";
import NotFound from "./pages/NotFound";

import { Auth } from "./utils/auth.js";

const HomeRedirect = () => {
  const user = Auth.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = Auth.getRedirectPath(user);
  return <Navigate to={redirectPath} replace />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {}
      <Route path="/" element={<HomeRedirect />} />

      {}
      <Route path="/login" element={<Login />} />

      {}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manage" 
        element={
          <ProtectedRoute requireRole="admin">
            <AdminManage />
          </ProtectedRoute>
        } 
      />

      {}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute requireRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user/steps" 
        element={
          <ProtectedRoute requireRole="user">
            <UserSteps />
          </ProtectedRoute>
        } 
      />

      {}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
