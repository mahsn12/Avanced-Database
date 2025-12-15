import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const InstructorHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="instructor-container">
        <h2 className="instructor-title">Instructor Dashboard</h2>

        <div className="instructor-actions">
          {/* SCENARIO 2: CREATE COURSE THREAD */}
          <div className="instructor-card">
            <h3>Create Thread</h3>
            <p>
              Start a new discussion thread for your course topics and
              guide students.
            </p>
            <button
              onClick={() => navigate("/instructor/create-thread")}
            >
              Create Thread
            </button>
          </div>

          {/* FUTURE: POST ANNOUNCEMENT */}
          <div className="instructor-card">
            <h3>Post Announcement</h3>
            <p>
              Share important updates or reminders with all enrolled students.
            </p>
            <button disabled>
              Coming Soon
            </button>
          </div>

          {/* FUTURE: MODERATION */}
          <div className="instructor-card">
            <h3>Moderate Discussions</h3>
            <p>
              Review reported replies and manage discussions.
            </p>
            <button
              onClick={() => navigate("/reports")}
            >
              Moderate
            </button>
          </div>

          {/* FUTURE: ANSWER QUESTIONS */}
          <div className="instructor-card">
            <h3>Answer Questions</h3>
            <p>
              Help students by answering questions and marking best answers.
            </p>
            <button
              onClick={() => navigate("/questions")}
            >
              View Questions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorHome;
