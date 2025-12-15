import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/app.css";

const Home = () => {
  const navigate = useNavigate();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // 🔐 HARD GUARD (prevents white screen)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH COURSES + ENROLLMENTS
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await API.get("/api/courses");
        const enrollmentsRes = await API.get(
          `/api/enrollments/student/${user._id}`
        );

        const enrolledIds = enrollmentsRes.data.map(e => e.courseID);

        setEnrolledCourses(
          coursesRes.data.filter(c => enrolledIds.includes(c._id))
        );

        setAllCourses(
          coursesRes.data.filter(c => !enrolledIds.includes(c._id))
        );
      } catch (err) {
        console.error("Failed to load courses");
      }
    };

    fetchData();
  }, [user._id]);

  /* =========================
     DROP COURSE
  ========================= */
  const dropCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to drop this course?")) return;

    try {
      setLoading(true);

      await API.post("/api/enrollments/drop", {
        userId: user._id,
        courseId,
      });

      setEnrolledCourses(prev =>
        prev.filter(c => c._id !== courseId)
      );

      setAllCourses(prev => [
        ...prev,
        enrolledCourses.find(c => c._id === courseId),
      ]);
    } catch {
      alert("Failed to drop course");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredExplore = allCourses.filter(course =>
    course.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="home-page">
        {/* ENROLLED COURSES */}
        <div className="home-section">
          <h2 className="section-title">My Enrolled Courses</h2>

          {enrolledCourses.length === 0 ? (
            <p className="empty-text">No enrolled courses.</p>
          ) : (
            <div className="course-grid">
              {enrolledCourses.map(course => (
                <div key={course._id} className="course-card enrolled">
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn primary"
                      onClick={() => navigate(`/threads/${course._id}`)}
                    >
                      View Threads
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => dropCourse(course._id)}
                      disabled={loading}
                    >
                      Drop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXPLORE COURSES */}
        <div className="home-section">
          <h2 className="section-title">Explore Courses</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {filteredExplore.length === 0 ? (
            <p className="empty-text">No courses found.</p>
          ) : (
            <div className="course-grid">
              {filteredExplore.map(course => (
                <div key={course._id} className="course-card explore">
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn success"
                      onClick={() =>
                        API.post("/api/enrollments/enroll", {
                          userId: user._id,
                          courseId: course._id,
                        }).then(() => window.location.reload())
                      }
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
