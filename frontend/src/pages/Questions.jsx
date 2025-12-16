import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionsByThread } from "../services/questionService";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Replies from "../pages/Replies";
import InstructorNavbar from "../components/InstructorNavbar.jsx"

const Questions = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD QUESTIONS
  ====================== */
  const loadQuestions = async () => {
    try {
      const data = await getQuestionsByThread(threadId);
      setQuestions(data);
    } catch (err) {
      console.error("LOAD QUESTIONS ERROR:", err);
    }
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

    try {
      setLoading(true);

      const threadRes = await API.get(`/api/threads/${threadId}`);
      const courseId = threadRes.data.courseId;

      let attachmentIds = [];

      // 🔹 Upload attachment first (if exists)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ownerId", user._id);

        const uploadRes = await API.post(
          "/api/attachments/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        attachmentIds.push(uploadRes.data._id);
      }

      // 🔹 Create question
      await API.post("/api/questions", {
        _id: `Q-${Date.now()}`,
        threadId,
        courseId,
        authorId: user._id,
        content,
        attachments: attachmentIds,
      });

      setContent("");
      setFile(null);
      await loadQuestions();
    } catch (err) {
  console.error("POST QUESTION ERROR:", err);
  console.error("RESPONSE:", err.response?.data);
  alert(err.response?.data?.message || "Failed to post question");
}
  };

  return (
    <>
    {user?.role === "instructor" ? <InstructorNavbar /> : <Navbar />}


      <div className="questions-page">
        <div className="questions-card">

          {/* HEADER */}
          <div className="card-header page-nav-style">
            <button
              className="page-nav-back"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            <h2 className="page-nav-title">Questions</h2>
          </div>

          {/* ASK QUESTION */}
          {user?.role === "student" && (
            <form className="question-form-card" onSubmit={postQuestion}>
              <textarea
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ask a question..."
                required
              />

              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <div className="form-actions">
                <button
                  className="btn primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Question"}
                </button>
              </div>
            </form>
          )}

          {/* QUESTIONS LIST */}
          <div className="question-card-list">
            {questions.map((q) => (
              <div key={q._id} className="question-card">

                <div className="question-header">
                  <p className="question-content">{q.content}</p>

                  {/* ATTACHMENTS */}
                  {q.attachments?.length > 0 && (
                    <div className="question-attachments">
                      {q.attachments.map((att) =>
                        att.mime.startsWith("image") ? (
                          <img
                            key={att._id}
                            src={att.url}
                            alt={att.filename}
                            className="attachment-image"
                          />
                        ) : (
                          <a
                            key={att._id}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="attachment-pdf"
                          >
                            📄 {att.filename}
                          </a>
                        )
                      )}
                    </div>
                  )}

                  <p className="question-meta">
                    Asked by: {q.authorId}
                  </p>
                </div>

                {/* Replies */}
                <Replies questionId={q._id} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Questions;
