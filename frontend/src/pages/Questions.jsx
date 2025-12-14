import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Reply from "../components/Reply";

export default function Questions() {
  const { threadId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    API.get(`/questions/${threadId}`).then(res => setQuestions(res.data));
  }, [threadId]);

  const askQuestion = async () => {
    await API.post("/questions", {
      threadId,
      authorId: "U101",
      content
    });
    setContent("");
  };

  return (
    <div>
      <h2>Questions</h2>

      <input
        placeholder="Ask a question"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={askQuestion}>Post</button>

      {questions.map(q => (
        <div key={q._id}>
          <p>{q.content}</p>
          <Reply questionId={q._id} />
        </div>
      ))}
    </div>
  );
}
