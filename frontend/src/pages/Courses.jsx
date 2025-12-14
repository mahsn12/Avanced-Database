import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/courses").then(res => setCourses(res.data));
  }, []);

  const enroll = async (courseId) => {
    await API.post("/enroll", {
      userId: "U101",
      courseId
    });
    navigate(`/threads/${courseId}`);
  };

  return (
    <div>
      <h2>Courses</h2>
      {courses.map(c => (
        <div key={c._id}>
          <p>{c.title}</p>
          <button onClick={() => enroll(c._id)}>Enroll</button>
        </div>
      ))}
    </div>
  );
}
