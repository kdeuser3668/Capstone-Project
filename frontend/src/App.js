import './App.css';
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import Focus from './Focus';
import Notes from './Notes';
import Progress from './Progress';
import Tasks from './Tasks';
import Settings from './Settings';

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {

  useEffect(() => {
    const savedColor = window.localStorage.getItem("textColor") || "#000000";
    document.documentElement.style.setProperty("--text-color", savedColor);
  }, []);

  useEffect(() => {
    const savedButtonColor = window.localStorage.getItem("buttonColor") || "#ee6dd5";
    document.documentElement.style.setProperty("--button-color", savedButtonColor);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginForm />} />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute>
                <Focus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
