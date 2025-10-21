// Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", formData);
      const user = res.data.user;

      // ✅ Save user to localStorage
      // Login.js — inside handleLogin success block:
      localStorage.setItem("gameshelfUser", JSON.stringify(res.data.user));
      
      alert(res.data.message);
      navigate(`/dashboard/${res.data.user.UserID}`);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <input name="Email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="Password" placeholder="Email" type="password" onChange={handleChange} required />
      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
