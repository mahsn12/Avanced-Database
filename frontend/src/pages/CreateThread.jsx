import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateThread() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [courseID, setCourseID] = useState("");
  const [loading, setLoading] = useState(false);

  const createThread = async () => {
    if (!title || !courseID) {
      alert("Title and course are required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in");
      return;
    }

    setLoading(true);

    const body = {
      _id: `T-${Date.now()}`,      // required by schema
      courseId: courseID,          // required by schema
      title,                       // required by schema
      creatorId: user._id,         // ✅ FIXED (from user object)
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    };

    try {
      const res = await fetch("http://localhost:5200/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create thread");
      }

      const thread = await res.json();

      // redirect to threads of the selected course
      navigate(`/threads/${thread.courseId}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-thread-container">
      <h2>Create New Thread</h2>

      <input
        placeholder="Course ID"
        value={courseID}
        onChange={e => setCourseID(e.target.value)}
      />

      <input
        placeholder="Thread Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea placeholder="Short description (optional)" />

      <input
        placeholder="Tags (e.g. MongoDB, Database Design)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />

      <button onClick={createThread} disabled={loading}>
        {loading ? "Creating..." : "Create Thread"}
      </button>
    </div>
  );
}
