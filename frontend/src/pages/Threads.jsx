import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Threads() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    API.get(`/threads/${courseId}`).then(res => setThreads(res.data));
  }, [courseId]);

  const createThread = async () => {
    await API.post("/threads", {
      courseId,
      title,
      createdBy: "U900"
    });
    setTitle("");
  };

  return (
    <div>
      <h2>Threads</h2>

      <input
        placeholder="Thread title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={createThread}>Create Thread</button>

      {threads.map(t => (
        <div key={t._id}>
          <p onClick={() => navigate(`/questions/${t._id}`)}>
            {t.title}
          </p>
        </div>
      ))}
    </div>
  );
}
