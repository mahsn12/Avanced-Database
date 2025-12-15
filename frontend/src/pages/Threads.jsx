import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getThreadsByCourse } from "../services/threadService";
import API from "../services/api";
import "../styles/app.css";

const Threads = () => {
  const { courseId } = useParams();
const user = JSON.parse(localStorage.getItem("user") || "null");

  const [threads, setThreads] = useState([]);

  useEffect(() => {
    getThreadsByCourse(courseId).then(setThreads);
  }, [courseId]);

  const subscribe = async (id) => {
    await API.post("/api/thread-subscriptions", {
      userId: user._id,
      threadId: id,
    });
    alert("Subscribed");
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Course Threads</h2>

      <div className="list">
        {threads.map(t => (
          <div key={t._id} className="list-item">
            <Link to={`/questions/${t._id}`} className="list-title">
              {t.title}
            </Link>
            {t.pinned && <span className="pin">📌</span>}

            <button
              className="btn btn-primary"
              onClick={() => subscribe(t._id)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Threads;
