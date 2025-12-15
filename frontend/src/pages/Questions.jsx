import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByThread } from "../services/questionService";
import { getRepliesByQuestion } from "../services/replyService";
import API from "../services/api";
import "../styles/app.css";
import Reply from "../components/Reply";

const Questions = () => {
  const { threadId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");
  const [repliesMap, setRepliesMap] = useState({});

  /* ======================
     LOAD QUESTIONS + REPLIES
     ====================== */
  const loadQuestions = async () => {
    const qs = await getQuestionsByThread(threadId);
    setQuestions(qs);

    const map = {};
    for (const q of qs) {
      map[q._id] = await getRepliesByQuestion(q._id);
    }
    setRepliesMap(map);
  };

  useEffect(() => {
    loadQuestions();
  }, [threadId]);

  /* ======================
     STUDENT: ASK QUESTION
     ====================== */
  const postQuestion = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "student") {
      alert("Only students can ask questions");
      return;
    }

    if (!content.trim()) return;

    const threadRes = await API.get(`/api/threads/${threadId}`);
    const courseId = threadRes.data.courseId;

    await API.post("/api/questions", {
      _id: `Q-${Date.now()}`,
      threadId,
      courseId,
      authorId: user._id,
      content,
    });

    setContent("");
    loadQuestions();
  };

  /* ======================
     REPORT REPLY
     ====================== */
  const reportReply = async (replyId) => {
    const reason = prompt("Enter report reason:");
    if (!reason) return;

    await API.post("/api/reports", {
      reporterId: user._id,
      targetId: replyId,
      targetType: "reply",
      reason,
    });

    alert("Reply reported");
  };

  /* ======================
     TOGGLE BEST ANSWER
     ====================== */
  const toggleBest = async (replyId, questionId) => {
    await API.patch("/api/replies/best", {
      replyId,
      questionId,
    });
    loadQuestions();
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Questions</h2>

      {/* STUDENT: ASK QUESTION */}
      {user?.role === "student" && (
        <form className="form" onSubmit={postQuestion}>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ask a question..."
            required
          />
          <button className="btn btn-primary">Post</button>
        </form>
      )}

      {/* QUESTIONS + REPLIES */}
      <div className="list">
        {questions.map((q) => (
          <div key={q._id} className="list-item">
            <strong>{q.content}</strong>
            <p className="meta">Asked by: {q.authorId}</p>

            {/* REPLIES */}
            {repliesMap[q._id]?.map((r) => (
              <div
                key={r._id}
                className={`reply ${r.isBest ? "best" : ""}`}
              >
                <p>{r.content}</p>
                <span className="meta">By: {r.authorId}</span>

                {/* INSTRUCTOR: MARK / REMOVE BEST */}
                {user?.role === "instructor" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => toggleBest(r._id, q._id)}
                  >
                    {r.isBest ? "Remove Best" : "Mark Best"}
                  </button>
                )}

                {/* STUDENT: REPORT */}
                {user?.role === "student" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => reportReply(r._id)}
                  >
                    Report
                  </button>
                )}

                {r.isBest && (
                  <span className="best-badge">✔ Best Answer</span>
                )}
              </div>
            ))}

            {/* REPLY BOX (STUDENT + INSTRUCTOR) */}
            {user && (
              <Reply
                questionId={q._id}
                onSuccess={loadQuestions}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
