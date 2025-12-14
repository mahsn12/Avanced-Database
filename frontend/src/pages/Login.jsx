import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const login = () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    // mock login (no backend)
    localStorage.setItem("user", JSON.stringify({
      email,
      role
    }));

    navigate("/");
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <br /><br />

      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}
