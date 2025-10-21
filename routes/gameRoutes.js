// routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllGames,
  addGameToUserCatalog,
  updateGameStatus,
} = require("../controllers/gameController");

// Get all available games
router.get("/", getAllGames);

// Add a game to a user's catalog
router.post("/usergames", addGameToUserCatalog);

// Update the status of a user's game
router.put("/usergames/:userId/:gameId", updateGameStatus);

module.exports = router;
