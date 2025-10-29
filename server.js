import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import  { Pool }from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

// const { Pool } = pkg;
const app = express();

app.use(bodyParser.json());

// Postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// ---- API ROUTES ----

// Get all experiences
app.get("/api/experiences", async (req, res) => {
  const result = await pool.query("SELECT * FROM experiences ORDER BY id");
  res.json(result.rows);
});

// Get timeslots for a specific experience
app.get("/api/experiences/:id", async (req, res) => {
  const { id } = req.params;
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const exp = (await pool.query("SELECT * FROM experiences WHERE id=$1", [id])).rows[0];
  const pre_slots = (
    await pool.query("SELECT * FROM timeslots WHERE experience_id=$1 AND date=$2 ORDER BY time", [id, date])
  ).rows;
  const slots = pre_slots.map(s => ({
    id: s.id,
    time: s.time,
    available: s.spots_left > 0,
    spotsLeft: s.spots_left,
    total: s.total_spots,
  }));

  res.json({ experience: exp, date, timeslots: slots });
});

// Book a slot
// app.post("/api/bookings", async (req, res) => {
//   const { experience_id, timeslot_id, date, time, customer_name, customer_email, seats } = req.body;

//   if (!experience_id || !timeslot_id || !customer_name || !customer_email)
//     return res.status(400).json({ error: "Missing fields" });

//   return res.status(201).json({ message: "Booked successfully" });
// });
app.post("/api/bookings", async (req, res) => {
  const { experience_id, timeslot_id, date, time, customer_name, customer_email, seats } = req.body;
  if (!experience_id || !timeslot_id || !customer_name || !customer_email) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tsResult = await client.query("SELECT * FROM timeslots WHERE id=$1 FOR UPDATE", [timeslot_id]);
    const ts = tsResult.rows[0];
    if (!ts) throw new Error("Timeslot not found");
    if (ts.spots_left < seats) throw new Error("Not enough spots left");
    // Update spots
    await client.query("UPDATE timeslots SET spots_left=$1 WHERE id=$2", [
      ts.spots_left - seats,
      timeslot_id,
    ]);
    // Create booking record
    const bookingId = uuidv4();
    await client.query(
      "INSERT INTO bookings (id, experience_id, timeslot_id, date, time, customer_name, customer_email, seats) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [bookingId, experience_id, timeslot_id, date, time, customer_name, customer_email, seats]
    );
    await client.query("COMMIT");
    return res.status(201).json({ bookingId, message: "Booked successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ---- SERVE FRONTEND BUILD ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, "dist");
app.use(express.static(frontendDir));

// Fallback to index.html (for React Router)
app.get("/(.*)/", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).send("API route not found");
  res.sendFile(path.join(frontendDir, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));

