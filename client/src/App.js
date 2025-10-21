import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./signup";
import Login from "./login";
import Dashboard from "./pages/dashboard";
import ManageGames from "./pages/managegames";
import LeaveReview from "./pages/leavereview";
import ManageFriends from "./pages/managefriends";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Always show navigation */}

        <Routes>
          <Route path="/" element={<h2>Welcome to GameShelf</h2>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="*" element={<h2>404 – Route Not Found</h2>} />
          <Route path="/manage-games" element={<ManageGames />} />
          <Route path="/leave-review" element={<LeaveReview />} />
          <Route path="/manage-friends" element={<ManageFriends />} />
        </Routes>
    </Router>
  );
}

export default App;
