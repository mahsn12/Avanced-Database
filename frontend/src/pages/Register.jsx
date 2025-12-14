import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const register = () => {
    if (!name || !email) {
      alert("Fill all fields");
      return;
    }

    // mock registration (no backend)
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, role })
    );

    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <br /><br />

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
      </select>

      <br /><br />

      <button onClick={register}>Register</button>
    </div>
  );
}
