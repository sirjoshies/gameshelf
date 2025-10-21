const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.get("/:userId/friends", friendController.getUserFriends);

module.exports = router;
