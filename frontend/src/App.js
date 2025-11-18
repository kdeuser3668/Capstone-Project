import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import Focus from './Focus';
import Notes from './Notes';
import Progress from './Progress';
import Tasks from './Tasks';
import Settings from './Settings';
import ProtectedRoute from './ProtectedRoute';
import CanvasPage from "./Canvas";


function App() {
  const [weekStart, setWeekStart] = useState('sunday');

  useEffect(() => {
    const savedColor = window.localStorage.getItem("textColor") || "#000000";
    document.documentElement.style.setProperty("--text-color", savedColor);
  }, []);

  useEffect(() => {
    const savedButtonColor = window.localStorage.getItem("buttonColor") || "#ee6dd5";
    document.documentElement.style.setProperty("--button-color", savedButtonColor);
  }, []);

  useEffect(() => {
    const savedShadowColor = window.localStorage.getItem("shadowColor") || "#eb59c199";
    document.documentElement.style.setProperty("--shadow-color", savedShadowColor);
  }, []);
    
  useEffect(() => {
    const savedBackgroundColor = window.localStorage.getItem("backgroundColor") || "#ffffff";
    document.documentElement.style.setProperty("--background-color", savedBackgroundColor);
  }, []);

  useEffect(() => {
    const savedSidebarColor = window.localStorage.getItem("sidebarColor") || "#f5f5f5";
    document.documentElement.style.setProperty("--sidebar-color", savedSidebarColor);
    }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar weekStart={weekStart} /></ProtectedRoute>} />
          <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings weekStart={weekStart} setWeekStart={setWeekStart} /></ProtectedRoute>} />
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
