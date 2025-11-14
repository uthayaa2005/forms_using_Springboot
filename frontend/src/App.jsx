import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import UserForm from "./components/UserForm.jsx";
import UserFormsList from "./components/UserFormsList.jsx";
import EditForm from "./components/EditForm.jsx";
import Viewform from "./components/Viewform.jsx";

export default function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard & Forms */}
          <Route path="/dashboard/:id/forms" element={<UserFormsList />} />
          <Route path="/dashboard/:id/forms/new" element={<UserForm />} />
          <Route path="/dashboard/:id/forms/edit/:formId" element={<EditForm />} />

          {/* Admin View Page */}
          <Route path="/viewforms" element={<Viewform />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold text-red-600">
                  🚫 404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
