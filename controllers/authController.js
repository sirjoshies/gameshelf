const sql = require("mssql");
const bcrypt = require("bcrypt");

// ✅ Toggle for password hashing
const USE_HASHING = false; // Set to true when ready for bcrypt

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

exports.signup = async (req, res) => {
  const { Username, Email, Password } = req.body;
  try {
    await sql.connect(dbConfig);

    const finalPassword = USE_HASHING
      ? await bcrypt.hash(Password, 10)
      : Password;

    const request = new sql.Request();
    request.input("Username", sql.VarChar, Username);
    request.input("Email", sql.VarChar, Email);
    request.input("Password", sql.VarChar, finalPassword);

    await request.query(`
      INSERT INTO Users (Username, Email, Password)
      VALUES (@Username, @Email, @Password)
    `);

    res.json({ message: "✅ Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input("Email", sql.VarChar, Email);

    const result = await request.query(`
      SELECT * FROM Users WHERE Email = @Email
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    let isMatch = false;

    if (USE_HASHING) {
      isMatch = await bcrypt.compare(Password, user.Password);
    } else {
      isMatch = Password === user.Password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "✅ Login successful",
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Email: user.Email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
