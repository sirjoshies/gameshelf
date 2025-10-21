require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// ✅ Import route files
const authRoutes = require("./routes/authRoutes");      // if you have this already
const userRoutes = require("./routes/userRoutes");      // NEW: User-specific routes
const reviewRoutes = require("./routes/reviewRoutes");
const gameRoutes = require("./routes/gameRoutes");
const friendRoutes = require("./routes/friendRoutes");


// ✅ Use API routes
app.use("/api", authRoutes);   // optional, if you already have it
app.use("/api", userRoutes);   // our new /users/:id/games + /friends
app.use("/api/reviews", reviewRoutes);
app.use("/api/games", gameRoutes);     // handles /:userId/games
app.use("/api/users", friendRoutes);   // handles /:userId/friends

// ✅ Existing test endpoint
app.get("/api/test-db", async (req, res) => {
  const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 1433,
    options: { encrypt: true, enableArithAbort: true },
  };

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT GETDATE() AS CurrentDateTime`;
    res.json({ connected: true, time: result.recordset[0].CurrentDateTime });
    await sql.close();
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

// ✅ Optional: List all users
app.get("/api/users", async (req, res) => {
  const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 1433,
    options: { encrypt: true, enableArithAbort: true },
  };

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT UserID, Username, Email, JoinDate FROM Users`;
    res.json(result.recordset);
    await sql.close();
  } catch (err) {
    console.error("❌ Error querying users:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// ✅ Serve React frontend after build
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
