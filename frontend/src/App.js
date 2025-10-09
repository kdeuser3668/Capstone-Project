import './App.css';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
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

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
