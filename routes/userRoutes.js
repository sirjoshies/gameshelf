const express = require("express");
const router = express.Router();
const {
  getUserGames,
  getUserFriends,
} = require("../controllers/userController");

router.get("/users/:id/games", getUserGames);
router.get("/users/:id/friends", getUserFriends);

module.exports = router;
