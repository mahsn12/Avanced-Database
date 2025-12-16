import { useEffect, useState } from "react";
import { getRepliesByQuestion } from "../services/replyService";
import API from "../services/api";

const Replies = ({ questionId }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD REPLIES
  ====================== */
  const load = async () => {
    const data = await getRepliesByQuestion(questionId);
    setReplies(data);
  };

  useEffect(() => {
    load();
  }, [questionId]);

  /* ======================
     POST REPLY (WITH ATTACHMENT)
  ====================== */
  const post = async (e) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    try {
      setLoading(true);

      let attachmentIds = [];

      // 🔹 upload attachment first
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

      // 🔹 create reply
      await API.post("/api/replies", {
        _id: `R-${Date.now()}`,
        questionId,
        authorId: user._id,
        content,
        attachments: attachmentIds,
      });

      setContent("");
      setFile(null);
      load();
    } catch (err) {
      console.error("POST REPLY ERROR:", err.response?.data || err);
      alert("Failed to post reply");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     REPORT REPLY (STUDENT)
  ====================== */
  const report = async (replyId) => {
    const reason = prompt("Enter report reason:");
    if (!reason || !user) return;

    await API.post("/api/reports", {
      _id: `RP-${Date.now()}`,
      reporterId: user._id,
      targetId: replyId,
      targetType: "reply",
      reason,
    });

    alert("Reply reported");
  };

  /* ======================
     MARK / UNMARK BEST
  ====================== */
  const toggleBest = async (replyId) => {
    await API.patch("/api/replies/best", {
      replyId,
      questionId,
    });
    load();
  };

  /* ======================
     VOTE (LIKE)
  ====================== */
  const vote = async (replyId) => {
    if (!user) return;

    try {
      await API.post("/api/votes/reply", {
        _id: `V-${Date.now()}`,
        userId: user._id,
        replyId,
        voteType: "upvote",
      });
      load();
    } catch {
      alert("You already voted");
    }
  };

  return (
    <div className="replies-section">
      {/* ================= REPLY BOX ================= */}
      {user && (
        <form className="reply-form" onSubmit={post}>
          <textarea
            className="form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
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
              disabled={loading}
            >
              {loading ? "Posting..." : "Reply"}
            </button>
          </div>
        </form>
      )}

      {/* ================= REPLIES ================= */}
      <div className="reply-list">
        {replies.map((r) => (
          <div
            key={r._id}
            className={`reply-card ${r.isBest ? "best" : ""}`}
          >
            <p className="reply-content">{r.content}</p>

            {/* ATTACHMENTS */}
            {r.attachments?.length > 0 && (
              <div className="reply-attachments">
                {r.attachments.map((att) =>
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

            <p className="reply-meta">By: {r.authorId}</p>

            <div className="reply-actions">
              {user && (
                <button
                  className="btn small"
                  onClick={() => vote(r._id)}
                >
                  👍 Like ({r.upvotes || 0})
                </button>
              )}

              {user?.role === "student" && (
                <button
                  className="btn danger small"
                  onClick={() => report(r._id)}
                >
                  Report
                </button>
              )}

              {(user?.role === "instructor" || user?.role === "admin") && (
                <button
                  className="btn warning small"
                  onClick={() => toggleBest(r._id)}
                >
                  {r.isBest ? "Remove Best" : "Mark Best"}
                </button>
              )}

              {r.isBest && (
                <span className="best-badge">✔ Best Answer</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Replies;
