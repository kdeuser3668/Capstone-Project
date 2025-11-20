import React, { useState } from "react";
import './App.css';

export default function CanvasIntegrationPage() {
  const [showSetup, setShowSetup] = useState(false);
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);   // NEW state for courses

  // ===== FRONTEND POST CALL =====
  const handleSubmitToken = async () => {
    if (!token) return alert("Please enter a token first");

    setSaving(true);

    try {
      const res = await fetch("http://localhost:5050/canvas/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,        // temporary placeholder
          canvasToken: token,  // MUST match backend variable name
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Token saved successfully!");
        setShowSetup(false);
      } else {
        alert(data.error || "Failed to save token");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — check backend logs");
    }

    setSaving(false);
  };

  // ===== FETCH COURSES =====
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5050/canvas/courses/1");
      const data = await res.json();

      if (data.success) {
        setCourses(data.courses);   // save courses to state
      } else {
        alert(data.error || "Failed to fetch courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      alert("Error fetching courses");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black text-white">
      {!showSetup ? (
        <div className="w-full max-w-2xl bg-neutral-900 p-12 rounded-2xl flex flex-col items-center text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">
            Canvas Integration Not Configured
          </h2>
          <p className="text-gray-300 mb-8 max-w-md">
            Connect your Canvas account to view courses, assignments, and grades in your productivity hub.
          </p>

          <button
            onClick={() => setShowSetup(true)}
            className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200"
          >
            ⚙️ Configure Canvas Integration
          </button>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-neutral-900 p-8 rounded-2xl shadow-lg">
          <button
            onClick={() => setShowSetup(false)}
            className="mb-4 underline text-blue-400 hover:text-blue-300"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-semibold mb-4">Canvas Integration Setup</h2>
          <p className="text-gray-300 mb-6">
            Follow these steps to generate your Canvas API Access Token.
          </p>

          <ol className="list-decimal list-inside space-y-2 text-base mb-6 text-gray-200">
            <li>Log in to your Canvas dashboard.</li>
            <li>Go to <strong>Account</strong> → <strong>Settings</strong>.</li>
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
            className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none mb-4"
          />

          <button
            onClick={handleSubmitToken}
            disabled={saving}
            className="w-full py-3 text-center bg-green-600 rounded-xl font-semibold hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save Token"}
          </button>

          <button
            onClick={fetchCourses}
            className="w-full py-3 mt-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700"
          >
            Fetch My Courses
          </button>

          {/* ===== RENDER COURSES ===== */}
          {courses.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="text-xl font-semibold mb-4">My Courses</h3>
              <ul className="space-y-2">
                {courses.map((course) => (
                  <li key={course.id} className="p-3 bg-neutral-800 rounded-lg">
                    {course.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
