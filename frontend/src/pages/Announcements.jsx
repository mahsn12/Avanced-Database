import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import InstructorNavbar from "../components/InstructorNavbar.jsx"

export default function Announcements() {
  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state?.courseId;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const postAnnouncement = async () => {
    if (!courseId || !message.trim()) {
      alert("Missing data");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5200/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ courseId, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to post announcement");
      }

      alert("Announcement sent");
      navigate("/instructor/home");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InstructorNavbar />

      <div className="announcement-page">
        <div className="announcement-card">

          {/* 🔙 CARD HEADER – SAME AS PageNav / CreateThread */}
          <div className="card-header page-nav-style">
            <button
              className="page-nav-back"
              onClick={() => navigate("/instructor/home")}
            >
              ← Back
            </button>

            <h2 className="page-nav-title">Post Announcement</h2>
          </div>

          <p className="course-context">
            <strong>Course ID:</strong> {courseId || "N/A"}
          </p>

          <textarea
            className="form-textarea"
            placeholder="Write announcement..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <div className="form-actions">
            <button
              className="btn primary"
              onClick={postAnnouncement}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Announcement"}
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
