const sql = require("mssql");
const dbConfig = require("../dbConfig");

exports.getUserFriends = async (req, res) => {
  const userId = req.params.userId;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT 
        f.UserID2,
        u.Username,
        f.FriendshipStatus
      FROM Friends f
      JOIN Users u ON f.UserID2 = u.UserID
      WHERE f.UserID1 = ${userId}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching friends:", err);
    res.status(500).json({ error: "Failed to get friends" });
  }
};
