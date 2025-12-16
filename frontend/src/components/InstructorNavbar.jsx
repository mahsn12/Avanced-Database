import React from "react";
import { Link, useNavigate } from "react-router-dom";

const InstructorNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h2 className="logo">DB ASU Community</h2>

        <div className="nav-links">
          <Link to="/instructor/home" className="nav-link">
            Dashboard
          </Link>

          <Link to="/reports" className="nav-link">
            Reports
          </Link>


          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
