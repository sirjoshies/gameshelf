// controllers/gameController.js
const sql = require("mssql");

const dbConfig = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

exports.getAllGames = async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT GameID, Title FROM Games
    `;
    res.json(result.recordset); // ✅ Must send .recordset
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: "Failed to retrieve games" });
  }
};

exports.addGameToUserCatalog = async (req, res) => {
  const { UserID, GameID, Status = "Not Started" } = req.body;

  try {
    await sql.connect(dbConfig);
    await sql.query`
      INSERT INTO UserGames (UserID, GameID, Status)
      VALUES (${UserID}, ${GameID}, ${Status})
    `;
    res.json({ message: "Game added to user catalog" });
  } catch (err) {
    console.error("Error adding game:", err);
    res.status(500).json({ error: "Failed to add game" });
  }
};

exports.updateGameStatus = async (req, res) => {
  const { userId, gameId } = req.params;
  const { Status } = req.body;

  try {
    await sql.connect(dbConfig);
    await sql.query`
      UPDATE UserGames
      SET Status = ${Status}
      WHERE UserID = ${userId} AND GameID = ${gameId}
    `;
    res.json({ message: "Game status updated" });
  } catch (err) {
    console.error("Error updating game status:", err);
    res.status(500).json({ error: "Failed to update game status" });
  }
};
