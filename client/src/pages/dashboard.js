import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Dashboard() {
  const { id } = useParams();            // Get user ID from URL
  const userId = parseInt(id);           // Make sure it's an integer
  const user = JSON.parse(localStorage.getItem("gameshelfUser"));

  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");

  console.log("📍 Dashboard for user ID:", userId);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const gameRes = await axios.get(`/api/users/${userId}/games`);
        const friendRes = await axios.get(`/api/users/${userId}/friends`);
        const reviewRes = await axios.get(`/api/reviews/${userId}`);

        setGames(gameRes.data || []);
        setFriends(friendRes.data || []);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/friends/request", {
        requesterId: userId,
        targetEmail: friendEmail,
      });
      alert("✅ Friend request sent!");
      setFriendEmail("");
    } catch (err) {
      console.error("Friend request error:", err);
      alert("❌ Failed to send request.");
    }
  };

  const handleFriendAction = async (targetId, action) => {
    try {
      await axios.post("/api/friends/respond", {
        userId: userId,
        targetId: targetId,
        action: action,
      });
      alert(`Friend request ${action}ed.`);
      const res = await axios.get(`/api/users/${userId}/friends`);
      setFriends(res.data);
    } catch (err) {
      console.error("Friend action error:", err);
    }
  };

  const handleReviewSubmit = async (e, gameId, existingReview) => {
    e.preventDefault();
    const rating = parseFloat(e.target.rating.value);
    const comment = e.target.comment.value;

    try {
      if (existingReview) {
        // Edit review
        await axios.patch(`/api/reviews/${existingReview.ReviewID}`, {
          Rating: rating,
          Comment: comment,
        });
        alert("✅ Review updated!");
      } else {
        // Create new review
        await axios.post("/api/reviews", {
          UserID: userId,
          GameID: gameId,
          Rating: rating,
          Comment: comment,
        });
        alert("✅ Review submitted!");
      }
      // Refresh reviews
      const updatedReviews = await axios.get(`/api/reviews/${userId}`);
      setReviews(updatedReviews.data || []);
    } catch (err) {
      console.error("Review error:", err);
      alert("❌ Review operation failed.");
    }
  };

  if (!userId) {
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {user?.Username || "User"}</h1>

      <h2>🎮 Your Games</h2>
      <ul>
        {games.map((game) => {
          const existingReview = reviews.find((rev) => rev.GameID === game.GameID);
          return (
            <li key={game.GameID} style={{ marginBottom: "1rem" }}>
              <strong>{game.Title}</strong> – {game.Status} – 
              ⭐ {existingReview ? existingReview.Rating : "N/A"}

              {game.Status === "Completed" && (
                <form onSubmit={(e) => handleReviewSubmit(e, game.GameID, existingReview)}>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    min="1"
                    max="10"
                    step="0.1"
                    defaultValue={existingReview ? existingReview.Rating : ""}
                    required
                  />
                  <input
                    type="text"
                    name="comment"
                    placeholder="Comment"
                    defaultValue={existingReview ? existingReview.Comment : ""}
                    required
                  />
                  <button type="submit">
                    {existingReview ? "Update Review" : "Submit Review"}
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>

      <h2>➕ Add a Friend</h2>
      <form onSubmit={handleAddFriend}>
        <input
          type="email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Friend's Email"
          required
        />
        <button type="submit">Send Friend Request</button>
      </form>

      <h2>👥 Your Friends</h2>
      <ul>
        {friends.map((f, index) => (
          <li key={index}>
            {f.Username ? f.Username : `User ID ${f.UserID2}`} – {f.FriendshipStatus}
            {f.FriendshipStatus === "Pending" && (
              <>
                <button onClick={() => handleFriendAction(f.UserID2, "accept")}>Accept</button>
                <button onClick={() => handleFriendAction(f.UserID2, "deny")}>Deny</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
