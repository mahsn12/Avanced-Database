import { useState } from "react";
import API from "../services/api";

export default function Reply({ questionId }) {
  const [reply, setReply] = useState("");

  const sendReply = async () => {
    await API.post("/replies", {
      questionId,
      authorId: "U102",
      content: reply
    });
    setReply("");
  };

  const upvote = async () => {
    await API.post("/votes", {
      replyId: questionId,
      userId: "U101"
    });
  };

  return (
    <div>
      <input
        placeholder="Reply"
        value={reply}
        onChange={e => setReply(e.target.value)}
      />
      <button onClick={sendReply}>Reply</button>
      <button onClick={upvote}>Upvote</button>
    </div>
  );
}
