import { useNavigate } from "react-router-dom";

export default function Threads() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Database Systems – Threads</h2>

      <div className="card">
        <h3>MongoDB Schema Design Tips</h3>
        <p>Discussion about embedding vs referencing documents.</p>
        <button onClick={() => navigate("/thread/1")}>
          View Thread
        </button>
      </div>

      <button className="secondary" onClick={() => navigate("/create-thread")}>
        Create New Thread
      </button>
    </div>
  );
}
