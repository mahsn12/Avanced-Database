import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const AdminHome = () => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  /* ======================
     STATE
  ====================== */
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [threads, setThreads] = useState([]);
  const [reports, setReports] = useState([]);

  /* 🔹 NEW: CREATE COURSE STATE */
  const [newCourse, setNewCourse] = useState({
    _id: "",
    title: "",
    code: "",
    description: "",
    instructorIds: "",
    term: "",
  });

  /* ======================
     LOAD ADMIN DATA
  ====================== */
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    API.get("/api/admin/users")
      .then(res => setUsers(res.data || []))
      .catch(() => setUsers([]));

    API.get("/api/admin/courses")
      .then(res => setCourses(res.data || []))
      .catch(() => setCourses([]));

    API.get("/api/admin/threads")
      .then(res => setThreads(res.data || []))
      .catch(() => setThreads([]));

    API.get("/api/reports")
      .then(res => setReports(res.data || []))
      .catch(() => setReports([]));
  }, [user]);

  /* ======================
     AUTH GUARD
  ====================== */
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  /* ======================
     USER ACTIONS
  ====================== */
  const toggleUserStatus = async (id, status) => {
    const resolveReport = async (id) => {
  await API.patch(`/api/reports/${id}/resolve`);

  setReports(prev =>
    prev.map(r =>
      r._id === id ? { ...r, status: "resolved" } : r
    )
  );
};


    setUsers(prev =>
      prev.map(u =>
        u._id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    await API.delete(`/api/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  /* ======================
     COURSE ACTIONS
  ====================== */
  const toggleCourseStatus = async (id, status) => {
    await API.patch(`/api/admin/courses/${id}`, {
      status: status === "active" ? "inactive" : "active",
    });

    setCourses(prev =>
      prev.map(c =>
        c._id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const addInstructor = async (courseId) => {
    const instructorId = prompt("Enter Instructor ID:");
    if (!instructorId) return;

    const res = await API.patch(
      `/api/admin/courses/${courseId}/instructors/add`,
      { instructorId }
    );

    setCourses(prev =>
      prev.map(c => (c._id === courseId ? res.data : c))
    );
  };

  const removeInstructor = async (courseId, instructorId) => {
    const res = await API.patch(
      `/api/admin/courses/${courseId}/instructors/remove`,
      { instructorId }
    );

    setCourses(prev =>
      prev.map(c => (c._id === courseId ? res.data : c))
    );
  };

  /* 🔹 NEW: CREATE COURSE */
  const createCourse = async () => {
    if (
      !newCourse._id ||
      !newCourse.title ||
      !newCourse.code ||
      !newCourse.term ||
      !newCourse.instructorIds
    ) {
      alert("Fill all required fields");
      return;
    }

    const res = await API.post("/api/admin/courses", {
      ...newCourse,
      instructorIds: newCourse.instructorIds
        .split(",")
        .map(i => i.trim()),
    });

    setCourses(prev => [...prev, res.data]);

    setNewCourse({
      _id: "",
      title: "",
      code: "",
      description: "",
      instructorIds: "",
      term: "",
    });
  };

  /* 🔹 NEW: DELETE COURSE */
  const deleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course permanently?")) return;

    await API.delete(`/api/admin/courses/${courseId}`);
    setCourses(prev => prev.filter(c => c._id !== courseId));
  };

  /* ======================
     REPORT ACTIONS
  ====================== */
const resolveReport = async (id) => {
  await API.patch(`/api/reports/${id}/resolve`);

  setReports(prev =>
    prev.map(r =>
      r._id === id ? { ...r, status: "resolved" } : r
    )
  );
};


  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2 className="section-title">Admin Dashboard</h2>

        {/* ================= CREATE COURSE (NEW) ================= */}
        <section className="admin-section">
          <h3>Create New Course</h3>

          <div className="admin-card">
            <input
              placeholder="Course ID (C300)"
              value={newCourse._id}
              onChange={e =>
                setNewCourse({ ...newCourse, _id: e.target.value })
              }
            />
            <input
              placeholder="Title"
              value={newCourse.title}
              onChange={e =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
            <input
              placeholder="Code"
              value={newCourse.code}
              onChange={e =>
                setNewCourse({ ...newCourse, code: e.target.value })
              }
            />
            <input
              placeholder="Term"
              value={newCourse.term}
              onChange={e =>
                setNewCourse({ ...newCourse, term: e.target.value })
              }
            />
            <input
              placeholder="Instructor IDs (comma separated)"
              value={newCourse.instructorIds}
              onChange={e =>
                setNewCourse({
                  ...newCourse,
                  instructorIds: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Description"
              value={newCourse.description}
              onChange={e =>
                setNewCourse({
                  ...newCourse,
                  description: e.target.value,
                })
              }
            />

            <button className="btn success" onClick={createCourse}>
              Create Course
            </button>
          </div>
        </section>

        {/* ================= USERS ================= */}
        <section className="admin-section">
          <h3>User Management</h3>
          <div className="admin-card-grid">
            {users.map(u => (
              <div key={u._id} className="admin-card">
                <strong>{u.name}</strong>
                <p>{u.email}</p>
                <p>Role: {u.role}</p>
                <p>Status: <span className={`status ${u.status}`}>{u.status}</span></p>

                <div className="card-actions">
                  <button
                    className="btn warning"
                    onClick={() => toggleUserStatus(u._id, u.status)}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= COURSES ================= */}
        <section className="admin-section">
          <h3>Course Management</h3>

          <div className="admin-card-grid">
            {courses.map(c => {
              const instructors = Array.isArray(c.instructorIds)
                ? c.instructorIds
                : [];

              return (
                <div key={c._id} className="admin-card">
                  <strong>{c.title}</strong>
                  <p>Code: {c.code}</p>
                  <p>Term: {c.term}</p>
                  <p>Students: {c.totalStudents ?? 0}</p>
                  <p>Status: <span className={`status ${c.status}`}>{c.status}</span></p>

                  <p>Instructors:</p>
                  {instructors.length === 0 && <p className="empty-text">None</p>}

                  {instructors.map(id => (
                    <div key={id} className="chip">
                      {id}
                      <button onClick={() => removeInstructor(c._id, id)}>✕</button>
                    </div>
                  ))}

                  <div className="card-actions">
                    <button
                      className="btn primary"
                      onClick={() => addInstructor(c._id)}
                    >
                      Add Instructor
                    </button>

                    <button
                      className="btn warning"
                      onClick={() => toggleCourseStatus(c._id, c.status)}
                    >
                      {c.status === "active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => deleteCourse(c._id)}
                    >
                      Delete Course
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= THREADS ================= */}
        <section className="admin-section">
          <h3>Threads Overview</h3>
          <div className="admin-card-grid">
            {threads.map(t => (
              <div key={t._id} className="admin-card">
                <strong>{t.title}</strong>
                <p>Course: {t.courseId}</p>
                <p>Status: <span className={`status ${t.status}`}>{t.status}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= REPORTS ================= */}
        <section className="admin-section">
          <h3>Reported Content</h3>
          <div className="admin-card-grid">
            {reports.map(r => (
              <div key={r._id} className="admin-card">
                <p><strong>{r.targetType}</strong></p>
                <p>{r.reason}</p>
                <p>Status: <span className={`status ${r.status}`}>{r.status}</span></p>

                {r.status === "pending" && (
                  <button
                    className="btn success"
                    onClick={() => resolveReport(r._id)}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminHome;
