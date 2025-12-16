import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getThreadsByCourse } from "../services/threadService";
import API from "../services/api";
import PageNav from "../components/PageNav";

const Threads = () => {
  const { courseId } = useParams();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  /* =========================
     STATE
  ========================= */
  const [threads, setThreads] = useState([]);

  /* =========================
     FETCH THREADS
  ========================= */
  useEffect(() => {
    if (!courseId) return;
    getThreadsByCourse(courseId).then(setThreads);
  }, [courseId]);

  /* =========================
     AUTH GUARD
  ========================= */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     SUBSCRIBE
  ========================= */
  const handleSubscribe = async (threadId) => {
    try {
      await API.post("/api/thread-subscriptions", {
        userId: user._id,
        threadId,
      });
      alert("Subscribed successfully");
    } catch {
      alert("Failed to subscribe");
    }
  };

  return (
    <div className="page-container">
      {/* 🔙 PAGE NAV */}
      <PageNav title="Course Threads" />

      {threads.length === 0 ? (
        <p className="empty-text">No threads available.</p>
      ) : (
        <div className="thread-card-grid">
          {threads.map(thread => (
            <div key={thread._id} className="thread-card">
              <div className="thread-card-header">
                <Link
                  to={`/questions/${thread._id}`}
                  className="thread-card-title"
                >
                  {thread.title}
                </Link>

                {thread.pinned && (
                  <span className="thread-card-pin" title="Pinned">
                    📌
                  </span>
                )}
              </div>

              <div className="thread-card-actions">
                <br/><br/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Threads;
