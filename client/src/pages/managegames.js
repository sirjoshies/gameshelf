// src/pages/ManageGames.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageGames() {
  const [allGames, setAllGames] = useState([]);
  const [userGames, setUserGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");

  const user = JSON.parse(localStorage.getItem("gameshelfUser"));
  const userId = user?.UserID;

  // 🔥 Extracted reusable fetch function
  const fetchGames = async () => {
    try {
      const allGamesRes = await axios.get("/api/games");
      setAllGames(allGamesRes.data || []);

      const userGamesRes = await axios.get(`/api/users/${userId}/games`);
      setUserGames(userGamesRes.data || []);
    } catch (err) {
      console.error("Error loading games:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGames();
    }
  }, [userId]);

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!selectedGame) return;

    try {
      await axios.post("/api/games/usergames", {
        UserID: userId,
        GameID: selectedGame,
        Status: "Not Started",
      });
      alert("✅ Game added to your catalog!");
      setSelectedGame("");
      await fetchGames(); // 🔥 Refresh after adding
    } catch (err) {
      console.error("Add game error:", err);
      alert("❌ Failed to add game.");
    }
  };

  const handleStatusChange = async (gameId, newStatus) => {
    console.log(`🛠 Attempting to PATCH status to: ${newStatus} for gameId: ${gameId}`);
  
    try {
      await axios.patch(`/api/games/usergames/${userId}/${gameId}`, 
        { Status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchGames();
    } catch (err) {
      console.error("🔥 handleStatusChange error:", err.response?.data || err.message);
      alert("❌ Failed to update game status.");
    }
  };

  return (
    <div>
      <h2>🎮 Your Game Collection</h2>
      <ul>
        {userGames.map((game) => (
          <li key={game.GameID} style={{ marginBottom: "1rem" }}>
            <strong>{game.Title}</strong> – Status:{" "}
            <select
              value={game.Status}
              onChange={(e) => handleStatusChange(game.GameID, e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="Playing">Playing</option>
              <option value="Completed">Completed</option>
              <option value="Dropped">Dropped</option>
            </select>
          </li>
        ))}
      </ul>

      <h3>➕ Add Game to Your Catalog</h3>
      <form onSubmit={handleAddGame}>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          required
        >
          <option value="">-- Select a Game --</option>
          {Array.isArray(allGames) &&
            allGames.map((game) => (
              <option key={game.GameID} value={game.GameID}>
                {game.Title}
              </option>
            ))}
        </select>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Game
        </button>
      </form>
    </div>
  );
}

export default ManageGames;
