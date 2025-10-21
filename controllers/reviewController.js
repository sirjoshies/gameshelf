// controllers/reviewController.js
const sql = require("mssql");
const dbConfig = require("../dbConfig");

exports.createReview = async (req, res) => {
  const { UserID, GameID, Rating, Comment } = req.body;

  try {
    await sql.connect(dbConfig);
    await sql.query`
      INSERT INTO Reviews (UserID, GameID, Rating, Comment)
      VALUES (${UserID}, ${GameID}, ${Rating}, ${Comment})
    `;
    res.status(201).json({ message: "✅ Review added" });
  } catch (err) {
    console.error("Review insert error:", err);
    res.status(500).json({ message: "❌ Failed to add review" });
  }
};

// controllers/reviewController.js

exports.getUserReviews = async (req, res) => {
  const { userId } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT Reviews.ReviewID, Reviews.GameID, Games.Title, Reviews.Rating, Reviews.Comment
      FROM Reviews
      JOIN Games ON Reviews.GameID = Games.GameID
      WHERE Reviews.UserID = ${userId}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { Rating, Comment } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`
      UPDATE Reviews
      SET Rating = ${Rating}, Comment = ${Comment}
      WHERE ReviewID = ${reviewId}
    `;
    res.json({ message: "Review updated" });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
};
