import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRepliesByQuestion } from "../services/replyService";
import API from "../services/api";
import "../styles/app.css";

const Replies = () => {
  const { questionId } = useParams();
 const user = JSON.parse(localStorage.getItem("user") || "null");


  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");

  const load = async () => {
    const data = await getRepliesByQuestion(questionId);
    setReplies(data);
  };

  useEffect(() => {
    load();
  }, [questionId]);

  const post = async (e) => {
    e.preventDefault();
    await API.post("/api/replies", {
      _id: `R-${Date.now()}`,
      questionId,
      authorId: user._id,
      content,
    });
    setContent("");
    load();
  };

  const upvote = async (id) => {
    await API.post("/api/votes/reply", {
      userId: user._id,
      replyId: id,
      voteType: "up",
    });
    load();
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Replies</h2>

      <form className="form" onSubmit={post}>
        <textarea
          className="textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a reply..."
          required
        />
        <button className="btn btn-primary">Reply</button>
      </form>

      <div className="list">
        {replies.map(r => (
          <div key={r._id} className={`list-item ${r.isBest ? "best" : ""}`}>
            <p>{r.content}</p>
            <p className="meta">Author: {r.authorId}</p>

            <button className="btn btn-success" onClick={() => upvote(r._id)}>
              👍 {r.upvotes}
            </button>

            {r.isBest && <span className="best-badge">Best Answer</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Replies;
