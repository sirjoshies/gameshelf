// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("gameshelfUser"))
  );

  const navigate = useNavigate();
  const location = useLocation(); // Triggers effect when route changes

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("gameshelfUser"));
    setUser(storedUser);
  }, [location]); // ✅ Update when route changes (user may log in or out)

  const handleLogout = () => {
    localStorage.removeItem("gameshelfUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
      {user ? (
        <>
          <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
          <Link to="/manage-games" style={{ marginRight: "10px" }}>Manage Games</Link>
          <Link to="/leave-review" style={{ marginRight: "10px" }}>Leave Review</Link>
          <Link to="/manage-friends" style={{ marginRight: "10px" }}>Manage Friends</Link>
          <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
          <Link to="/login">Login</Link>
          <button onClick={handleLogout} style={{ float: "right" }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
