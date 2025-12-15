import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByThread } from "../services/questionService";
import API from "../services/api";
import "../styles/app.css";

const Questions = () => {
  const { threadId } = useParams();
const user = JSON.parse(localStorage.getItem("user") || "null");

  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");

  const load = async () => {
    const data = await getQuestionsByThread(threadId);
    setQuestions(data);
  };

  useEffect(() => {
    load();
  }, [threadId]);

  const post = async (e) => {
    e.preventDefault();
    await API.post("/api/questions", {
      _id: `Q-${Date.now()}`,
      threadId,
      authorId: user._id,
      content,
    });
    setContent("");
    load();
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Questions</h2>

      <form className="form" onSubmit={post}>
        <textarea
          className="textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Ask a question..."
          required
        />
        <button className="btn btn-primary">Post</button>
      </form>

      <div className="list">
        {questions.map(q => (
          <div key={q._id} className="list-item">
            <strong>{q.content}</strong>
            <p className="meta">Author: {q.authorId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
