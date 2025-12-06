import React, { useState, useEffect } from "react";
import './App.css';
import Sidebar from "./Sidebar";

export default function CanvasPage() {
  const [showSetup, setShowSetup] = useState(false);
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH COURSES ON MOUNT =====
  useEffect(() => {
    fetchCourses().finally(() => setLoading(false));
  }, []);

  const handleSubmitToken = async () => {
    if (!token) return alert("Please enter a token first");
    setSaving(true);

    try {
      const res = await fetch("https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend/canvas/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, canvasToken: token }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Token saved successfully!");
        setShowSetup(false);
        fetchCourses(); // immediately load courses
      } else {
        alert(data.error || "Failed to save token");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — check backend logs");
    }
    setSaving(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend/canvas/courses/1");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      } else {
        setCourses([]); // no token case
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--background-color)" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", color: "var(--text-color)" }}>
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <p>Loading your courses...</p>
          ) : courses.length > 0 ? (
            <div
              style={{
                backgroundColor: "var(--sidebar-color)",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: `0 4px 8px var(--shadow-color)`,
              }}
            >
              <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
              <ul className="space-y-2">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      backgroundColor: "var(--background-color)",
                      color: "var(--text-color)",
                    }}
                  >
                    {course.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : !showSetup ? (
            <div
              style={{
                backgroundColor: "var(--sidebar-color)",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: `0 4px 8px var(--shadow-color)`,
              }}
            >
              <h2 className="text-2xl font-semibold mb-2">
                Canvas Integration Not Configured
              </h2>
              <p className="mb-6">
                Connect your Canvas account to view courses, assignments, and grades.
              </p>
              <button
                onClick={() => setShowSetup(true)}
                style={{
                  backgroundColor: "var(--button-color)",
                  color: "var(--text-color)",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "block",
                  margin: "2rem auto 0 auto", // ✅ centered
                }}
              >
                ⚙️ Configure Canvas Integration
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--sidebar-color)",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: `0 4px 8px var(--shadow-color)`,
              }}
            >
              <button
                onClick={() => setShowSetup(false)}
                style={{ color: "var(--button-color)", marginBottom: "1rem" }}
              >
                ← Back
              </button>

              <h2 className="text-3xl font-semibold mb-4">Canvas Integration Setup</h2>
              <p className="mb-6">
                Follow these steps to generate your Canvas API Access Token.
              </p>

              <ol className="list-decimal list-inside space-y-2 mb-6">
                <li>Log in to your Canvas dashboard.</li>
                <li>Go to <strong>Account → Settings</strong>.</li>
                <li>Scroll to <strong>Approved Integrations</strong>.</li>
                <li>Click <strong>+ New Access Token</strong>.</li>
                <li>Enter a purpose — e.g. "Productivity Hub".</li>
                <li>Click <strong>Generate Token</strong>.</li>
                <li>Copy the token immediately.</li>
                <li>Paste it below.</li>
              </ol>

              <input
                type="text"
                placeholder="Paste your Canvas token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--shadow-color)",
                  marginBottom: "1rem",
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                }}
              />

              <button
                onClick={handleSubmitToken}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "green",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save Token"}
              </button>

              <button
                onClick={fetchCourses}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "blue",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Fetch My Courses
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
