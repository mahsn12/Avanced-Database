import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    setError("");

    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    } 
      const res = await fetch("http://localhost:5200/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name,password,role }),
      });
    if(!res.ok){
      alert("Failed to Register");
      return;
    }
    alert(`Registered as ${role}`);
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Create Account</h2>

      {error && <div className="error">{error}</div>}

      <input
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* ROLE DROPDOWN */}
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={register}>Create Account</button>

      <p className="muted">
        Already have an account?{" "}
        <span className="link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}
