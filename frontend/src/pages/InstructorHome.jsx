import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorNavbar from "../components/InstructorNavbar";

const InstructorHome = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch("http://localhost:5200/api/courses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(allCourses => {
        const instructorCourses = allCourses.filter(course =>
          course.instructorIds.includes(user._id)
        );
        setCourses(instructorCourses);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* ✅ INSTRUCTOR NAVBAR */}
      <InstructorNavbar />

      <div className="instructor-page">
        <h2 className="instructor-title">Instructor Dashboard</h2>

        {/* ======================
            COURSES
        ====================== */}
        <div className="instructor-course-grid">
          {courses.length === 0 ? (
            <p className="empty-text">No assigned courses.</p>
          ) : (
            courses.map(course => (
              <div key={course._id} className="instructor-course-card">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-code">Course Code: {course.code}</p>
                </div>

                <div className="course-actions">
                  <button
                    className="btn primary"
                    onClick={() =>
                      navigate("/instructor/create-thread", {
                        state: { courseId: course._id },
                      })
                    }
                  >
                    Create Thread
                  </button>

                  <button
                    className="btn success"
                    onClick={() => navigate(`/threads/${course._id}`)}
                  >
                    View Threads
                  </button>

                  <button
                    className="btn warning"
                    onClick={() =>
                      navigate("/announcements", {
                        state: { courseId: course._id },
                      })
                    }
                  >
                    Post Announcement
                  </button>

                  <button
                    className="btn danger"
                    onClick={() =>
                      navigate(`/questions/course/${course._id}`)
                    }
                  >
                    Answer Questions
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ======================
            MODERATION
        ====================== */}
        <div className="instructor-moderation">
          <div className="instructor-moderation-card">
            <h3>Moderate Discussions</h3>
            <p>
              Review reported replies and manage discussions across all courses.
            </p>
            <button
              className="btn primary"
              onClick={() => navigate("/reports")}
            >
              Moderate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorHome;
