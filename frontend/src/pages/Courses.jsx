import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Available Courses</h2>

      <div className="card">
        <h3>Database Systems</h3>
        <p>Learn database design, SQL, and NoSQL systems.</p>
        <button onClick={() => navigate("/threads")}>
          Enroll & View Threads
        </button>
      </div>
    </div>
  );
}
