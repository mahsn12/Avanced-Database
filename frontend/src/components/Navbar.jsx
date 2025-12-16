import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    const fetchUnread = async () => {
      try {
        const res = await API.get("/api/notifications/unread-count", {
          params: { userId: user._id },   // ✅ PER USER
        });
        setUnread(res.data.unread);
      } catch (err) {
        console.error("Unread count error", err);
        setUnread(0);
      }
    };

    fetchUnread();
  }, [user?._id]);   // ✅ KEY FIX (per-user)

  const handleLogout = () => {
    localStorage.clear();
    setUnread(0);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <h2 className="logo">DB ASU Community</h2>

        <div className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>

          <Link to="/notifications" className="nav-link">
            🔔 Notifications
            {unread > 0 && <span className="badge">{unread}</span>}
          </Link>

          

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
