import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageFriends() {
  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const user = JSON.parse(localStorage.getItem("gameshelfUser"));
  const userId = user?.UserID;

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}/friends`);
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/friends/request", {
        requesterId: userId,
        targetEmail: friendEmail,
      });
      alert("✅ Friend request sent!");
      setFriendEmail("");
      // Refresh list
      const res = await axios.get(`/api/users/${userId}/friends`);
      setFriends(res.data);
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("❌ Failed to send request.");
    }
  };

  const handleFriendAction = async (targetId, action) => {
    try {
      await axios.post("/api/friends/respond", {
        userId: userId,
        targetId: targetId,
        action: action, // 'accept', 'deny', or 'remove'
      });
      alert(`✅ Friend ${action}ed.`);
      const res = await axios.get(`/api/users/${userId}/friends`);
      setFriends(res.data);
    } catch (err) {
      console.error("Friend action error:", err);
      alert("❌ Failed to perform action.");
    }
  };

  if (!userId) {
    return <p>Please log in to manage friends.</p>;
  }

  // Group friends by status
  const acceptedFriends = friends.filter(f => f.FriendshipStatus === "Accepted");
  const pendingFriends = friends.filter(f => f.FriendshipStatus === "Pending");
  const blockedFriends = friends.filter(f => f.FriendshipStatus === "Blocked");

  return (
    <div>
      <h1>Manage Friends</h1>

      <h2>➕ Add a New Friend</h2>
      <form onSubmit={handleSendFriendRequest}>
        <input
          type="email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Friend's Email"
          required
        />
        <button type="submit">Send Request</button>
      </form>

      <h2>👥 Your Friends</h2>
      {acceptedFriends.length === 0 ? <p>No friends yet.</p> : (
        <ul>
          {acceptedFriends.map((friend, index) => (
            <li key={index}>
              {friend.Username || `User ID ${friend.UserID2}`}  
              <button onClick={() => handleFriendAction(friend.UserID2, "remove")} style={{ marginLeft: "1rem" }}>
                Remove Friend
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>⏳ Pending Requests</h2>
      {pendingFriends.length === 0 ? <p>No pending requests.</p> : (
        <ul>
          {pendingFriends.map((friend, index) => (
            <li key={index}>
              {friend.Username || `User ID ${friend.UserID2}`} 
              <button onClick={() => handleFriendAction(friend.UserID2, "accept")} style={{ marginLeft: "1rem" }}>
                Accept
              </button>
              <button onClick={() => handleFriendAction(friend.UserID2, "deny")} style={{ marginLeft: "0.5rem" }}>
                Deny
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>🚫 Blocked Users</h2>
      {blockedFriends.length === 0 ? <p>No blocked users.</p> : (
        <ul>
          {blockedFriends.map((friend, index) => (
            <li key={index}>
              {friend.Username || `User ID ${friend.UserID2}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageFriends;
