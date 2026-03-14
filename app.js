const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "app",
  password: process.env.DB_PASSWORD || "app",
  database: process.env.DB_NAME || "appdb",
});

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    res.json({
      status: "ok",
      database: "connected",
      serverTime: result.rows[0].current_time,
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, content, created_at FROM messages ORDER BY id DESC LIMIT 20",
    );
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Cannot fetch messages", details: error.message });
  }
});

app.post("/api/messages", async (req, res) => {
  const content = req.body?.content;

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Field 'content' is required" });
  }

  const normalizedContent = content.trim().slice(0, 250);

  try {
    const result = await pool.query(
      "INSERT INTO messages (content) VALUES ($1) RETURNING id, content, created_at",
      [normalizedContent],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Cannot save message", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
    endpoints: ["GET /api/health", "GET /api/messages", "POST /api/messages"],
  });
});

const server = app.listen(PORT, () => {
  console.log(`Backend is running on port http://localhost:${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down backend...");
  await pool.end();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
