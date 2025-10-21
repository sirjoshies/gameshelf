import React, { useEffect, useState } from "react";
import axios from "axios";

function LeaveReview() {
  const [userGames, setUserGames] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewForms, setReviewForms] = useState({}); // Track form inputs

  const user = JSON.parse(localStorage.getItem("gameshelfUser"));
  const userId = user?.UserID;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const gamesRes = await axios.get(`/api/users/${userId}/games`);
        const reviewsRes = await axios.get(`/api/reviews/${userId}`);
        setUserGames(gamesRes.data || []);
        setUserReviews(reviewsRes.data || []);

        // Initialize form states
        const initialForms = {};
        (reviewsRes.data || []).forEach((review) => {
          initialForms[review.GameID] = {
            rating: review.Rating,
            comment: review.Comment,
            reviewId: review.ReviewID,
          };
        });
        setReviewForms(initialForms);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [userId]);

  const handleFormChange = (gameId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (gameId) => {
    try {
      const { rating, comment } = reviewForms[gameId];
      await axios.post("/api/reviews", {
        UserID: userId,
        GameID: gameId,
        Rating: rating,
        Comment: comment,
      });
      alert("✅ Review submitted!");
      window.location.reload();
    } catch (err) {
      console.error("Submit review error:", err);
      alert("❌ Failed to submit review.");
    }
  };

  const handleUpdateReview = async (reviewId, gameId) => {
    try {
      const { rating, comment } = reviewForms[gameId];
      await axios.patch(`/api/reviews/${reviewId}`, {
        Rating: rating,
        Comment: comment,
      });
      alert("✅ Review updated!");
      window.location.reload();
    } catch (err) {
      console.error("Update review error:", err);
      alert("❌ Failed to update review.");
    }
  };

  const hasReview = (gameId) => {
    return userReviews.find((r) => r.GameID === gameId);
  };

  if (!userId) {
    return <p>Please log in to leave reviews.</p>;
  }

  return (
    <div>
      <h2>📝 Leave or Edit Reviews</h2>
      <ul>
        {userGames.map((game) => {
          const existingReview = hasReview(game.GameID);
          return (
            <li key={game.GameID} style={{ marginBottom: "1.5rem" }}>
              <strong>{game.Title}</strong> – Status: {game.Status}
              {game.Status === "Completed" && (
                <div style={{ marginTop: "0.5rem" }}>
                  <input
                    type="number"
                    placeholder="Rating"
                    min="1"
                    max="10"
                    step="0.1"
                    value={reviewForms[game.GameID]?.rating || ""}
                    onChange={(e) =>
                      handleFormChange(game.GameID, "rating", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Comment"
                    value={reviewForms[game.GameID]?.comment || ""}
                    onChange={(e) =>
                      handleFormChange(game.GameID, "comment", e.target.value)
                    }
                    style={{ marginLeft: "10px" }}
                  />
                  {existingReview ? (
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        handleUpdateReview(existingReview.ReviewID, game.GameID)
                      }
                    >
                      ✏️ Update Review
                    </button>
                  ) : (
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleSubmitReview(game.GameID)}
                    >
                      ➕ Submit Review
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <hr />

      <h2>📚 Your Reviews</h2>
      <ul>
        {userReviews.map((review) => (
          <li key={review.ReviewID}>
            <strong>{review.Title}</strong> – ⭐ {review.Rating} – "{review.Comment}"
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaveReview;
