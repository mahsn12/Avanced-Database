import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InstructorNavbar from "../components/InstructorNavbar.jsx"
export default function CreateThread() {
  const navigate = useNavigate();
  const location = useLocation();

  const courseID = location.state?.courseId;

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const createThread = async () => {
    if (!courseID) {
      alert("Course context missing. Go back and select a course.");
      return;
    }

    if (!title.trim()) {
      alert("Thread title is required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in");
      return;
    }

    setLoading(true);

    const body = {
      _id: `T-${Date.now()}`,
      courseId: courseID,
      title,
      creatorId: user._id,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    };

    try {
      const res = await fetch("http://localhost:5200/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create thread");
      }

      const thread = await res.json();
      navigate(`/threads/${thread.courseId}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InstructorNavbar />

      <div className="create-thread-page">
        <div className="create-thread-card">

          {/* 🔙 CARD HEADER – SAME STYLE AS PageNav */}
          <div className="card-header page-nav-style">
            <button
              className="page-nav-back"
              onClick={() => navigate("/instructor/home")}
            >
              ← Back
            </button>

            <h2 className="page-nav-title">Create New Thread</h2>
          </div>

          <p className="course-context">
            <strong>Course ID:</strong> {courseID || "N/A"}
          </p>

          <input
            className="form-input"
            placeholder="Thread Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            className="form-textarea"
            placeholder="Short description (optional)"
          />

          <input
            className="form-input"
            placeholder="Tags (e.g. MongoDB, Database Design)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />

          <div className="form-actions">
            <button
              className="btn primary"
              onClick={createThread}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Thread"}
            </button>

            <button
              className="btn"
              onClick={() => navigate("/instructor/home")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
