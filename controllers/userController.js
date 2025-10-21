const sql = require("mssql");

const config = {
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

exports.getUserGames = async (req, res) => {
  const userId = req.params.id;
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT UG.*, G.Title
      FROM UserGames UG
      JOIN Games G ON UG.GameID = G.GameID
      WHERE UG.UserID = ${userId}`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

exports.getUserFriends = async (req, res) => {
  const userId = req.params.id;
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM Friends WHERE UserID1 = ${userId}`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};
