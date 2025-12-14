// src/components/CourseCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="course-card">
      <h3>{course.name}</h3>
      <p>{course.description}</p>

      <button
        onClick={() => navigate(`/threads/${course._id}`)}
      >
        View Threads
      </button>
    </div>
  );
};

export default CourseCard;
