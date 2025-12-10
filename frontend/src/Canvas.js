import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";

export default function CanvasPage({ currentUser }) {
  const [showSetup, setShowSetup] = useState(false);
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // ✅ Use the logged-in user's ID instead of hardcoding
  const userId = currentUser?.id || JSON.parse(localStorage.getItem("user"))?.id || null;

  useEffect(() => {
    if (userId) {
      fetchCourses().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleSubmitToken = async () => {
    if (!token) return alert("Please enter a token first");
    if (!userId) return alert("No user logged in");
    setSaving(true);

    try {
      const res = await fetch(
        "https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend/canvas/save-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, canvasToken: token }), // ✅ dynamic userId
        }
      );

      const data = await res.json();
      if (res.ok) {
        if (data.alreadyExists) {
          alert("You already have a token saved. No need to re-add it!");
          setHasToken(true);
        } else {
          alert("Token saved successfully!");
          setHasToken(true);
        }
        setShowSetup(false);
        fetchCourses();
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
    if (!userId) return;
    try {
      const res = await fetch(
        `https://plannerpal-ex34i.ondigitalocean.app/capstone-project-backend/canvas/courses/${userId}` // ✅ dynamic userId
      );
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        setHasToken(true);
      } else {
        setCourses([]);
        setHasToken(false);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
      setHasToken(false);
    }
  };

  const handleBackToInstructions = () => setShowSetup(true);
  const handleBackToCourses = () => setShowSetup(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--background-color)" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", color: "var(--text-color)" }}>
        <div className="max-w-3xl mx-auto">
          {showSetup ? (
            <div
              style={{
                backgroundColor: "var(--sidebar-color)",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: `0 4px 8px var(--shadow-color)`,
              }}
            >
              <h2 className="text-2xl font-semibold mb-2">Enter Canvas Token</h2>

              {hasToken && (
                <div
                  style={{
                    backgroundColor: "#d1fae5",
                    border: "1px solid #10b981",
                    color: "#065f46",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  You already have a token saved. You don’t need to re-add it unless you want to update.
                </div>
              )}

              <div style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
                <h3 className="text-xl font-semibold mb-2">How to Generate Your Canvas Token</h3>
                <ol style={{ paddingLeft: "1.5rem" }}>
                  <li>
                    Log in to{" "}
                    <a
                      href="https://umsystem.instructure.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      UMSystem Canvas
                    </a>.
                  </li>
                  <li>Click your profile picture → <strong>Account</strong>.</li>
                  <li>Select <strong>Settings</strong>.</li>
                  <li>
                    Scroll down to <strong>Approved Integrations</strong> and click{" "}
                    <strong>+ New Access Token</strong>.
                  </li>
                  <li>Enter a purpose (e.g., "PlannerPal Integration") and optionally set an expiration date.</li>
                  <li>Click <strong>Generate Token</strong>.</li>
                  <li>Copy the token shown — ⚠️ it will only be displayed once.</li>
                  <li>Paste it into the field below and click <strong>Save Token</strong>.</li>
                </ol>
              </div>

              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your Canvas token here"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handleSubmitToken}
                  disabled={saving}
                  style={{
                    backgroundColor: "var(--button-color)",
                    color: "var(--text-color)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save Token"}
                </button>
                <button
                  onClick={handleBackToCourses}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--button-color)",
                    color: "var(--text-color)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  ← Back to Courses
                </button>
              </div>
            </div>
          ) : loading ? (
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {courses.map((course, index) => {
                  const colors = ["#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
                  const cardColor = colors[index % colors.length];

                  return (
                    <div
                      key={course.id}
                      style={{
                        backgroundColor: cardColor,
                        borderRadius: "16px",
                        padding: "1.5rem",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        color: "#333",
                      }}
                    >
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>
                        {course.name}
                      </h3>

                      {Array.isArray(course.assignments) && course.assignments.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                          {course.assignments.map((a) => (
                            <li
                              key={a.id}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.8)",
                                padding: "0.5rem",
                                borderRadius: "8px",
                                marginBottom: "0.5rem",
                              }}
                            >
                              📌 {a.name} —{" "}
                              {a.due_at ? new Date(a.due_at).toLocaleDateString() : "No due date"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontStyle: "italic", color: "#555" }}>No assignments found</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleBackToInstructions}
                style={{
                  marginTop: "2rem",
                  backgroundColor: "var(--button-color)",
                  color: "var(--text-color)",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Back to Instructions
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
              <h2 className="text-2xl font-semibold mb-2">Canvas Integration Not Configured</h2>
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
                  margin: "2rem auto 0 auto",
                }}
              >
                ⚙️ Configure Canvas Integration
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
