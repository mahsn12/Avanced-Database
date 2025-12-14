// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">DB Forum</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/threads">Threads</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
