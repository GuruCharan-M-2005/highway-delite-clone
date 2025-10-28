import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import pkg from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
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
  const slots = (
    await pool.query("SELECT * FROM timeslots WHERE experience_id=$1 AND date=$2 ORDER BY time", [id, date])
  ).rows;
  res.json({ experience: exp, date, timeslots: slots });
});

// Book a slot
app.post("/api/bookings", async (req, res) => {
  const { experience_id, timeslot_id, date, time, customer_name, customer_email, seats } = req.body;
  if (!experience_id || !timeslot_id || !customer_name || !customer_email)
    return res.status(400).json({ error: "Missing fields" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const ts = (
      await client.query("SELECT * FROM timeslots WHERE id=$1 FOR UPDATE", [timeslot_id])
    ).rows[0];
    if (!ts || ts.spots_left < seats) throw new Error("Not enough spots");

    await client.query("UPDATE timeslots SET spots_left=$1 WHERE id=$2", [ts.spots_left - seats, timeslot_id]);
    const bookingId = uuidv4();
    await client.query(
      "INSERT INTO bookings (id, experience_id, timeslot_id, date, time, customer_name, customer_email, seats) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [bookingId, experience_id, timeslot_id, date, time, customer_name, customer_email, seats]
    );
    await client.query("COMMIT");
    res.status(201).json({ bookingId, message: "Booked successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message });
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




// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const { Pool } = require('pg');
// const bodyParser = require('body-parser');
// const { v4: uuidv4 } = require('uuid');

// const app = express();
// app.use(bodyParser.json());

// // Connect to Postgres
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// // --- Serve static frontend ---
// const frontendDir = path.join(__dirname, 'frontend', 'dist');
// app.use(express.static(frontendDir));

// // --- API routes ---
// app.get('/api/experiences', async (req, res) => {
//   const result = await pool.query('SELECT * FROM experiences ORDER BY id');
//   res.json(result.rows);
// });

// app.get('/api/experiences/:id', async (req, res) => {
//   const { id } = req.params;
//   const dateStr = req.query.date || new Date().toISOString().slice(0, 10);
//   const exp = (await pool.query('SELECT * FROM experiences WHERE id=$1', [id])).rows[0];
//   const slots = (
//     await pool.query(
//       'SELECT * FROM timeslots WHERE experience_id=$1 AND date=$2 ORDER BY time',
//       [id, dateStr]
//     )
//   ).rows;
//   res.json({ experience: exp, date: dateStr, timeslots: slots });
// });

// app.post('/api/bookings', async (req, res) => {
//   const {
//     experience_id,
//     timeslot_id,
//     date,
//     time,
//     customer_name,
//     customer_email,
//     seats,
//     promo_code,
//   } = req.body;
//   if (!experience_id || !timeslot_id || !customer_name || !customer_email)
//     return res.status(400).json({ error: 'Missing fields' });

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     const ts = (
//       await client.query(
//         'SELECT * FROM timeslots WHERE id=$1 AND experience_id=$2 AND date=$3 FOR UPDATE',
//         [timeslot_id, experience_id, date]
//       )
//     ).rows[0];
//     if (!ts || ts.spots_left < seats) throw new Error('Not enough spots');

//     await client.query('UPDATE timeslots SET spots_left=$1 WHERE id=$2', [
//       ts.spots_left - seats,
//       timeslot_id,
//     ]);
//     const bookingId = uuidv4();
//     await client.query(
//       `INSERT INTO bookings (id, experience_id, timeslot_id, date, time, customer_name, customer_email, seats, promo_code)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
//       [bookingId, experience_id, timeslot_id, date, time, customer_name, customer_email, seats, promo_code || null]
//     );
//     await client.query('COMMIT');
//     res.status(201).json({ bookingId, message: 'Booked' });
//   } catch (e) {
//     await client.query('ROLLBACK');
//     res.status(400).json({ error: e.message });
//   } finally {
//     client.release();
//   }
// });

// app.post('/api/promo/validate', (req, res) => {
//   const promoCodes = { SUMMER20: 0.2, FIRST10: 0.1, VIP25: 0.25 };
//   const { code } = req.body;
//   if (promoCodes[code]) res.json({ valid: true, discount: promoCodes[code] });
//   else res.json({ valid: false });
// });

// // --- Fallback: serve frontend index.html ---
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendDir, 'index.html'));
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on ${port}`));











// // COORECT CODE -> BEFORE 
// // // server.js
// // import dotenv from 'dotenv';
// // import express from 'express';
// // import { Pool } from 'pg';
// // import path from 'path';
// // import bodyParser from 'body-parser';
// // import { v4 as uuidv4 } from 'uuid';
// // import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // dotenv.config();

// // const app = express();
// // app.use(bodyParser.json());
// // // app.use(express.static(__dirname));
// // app.use(express.static(path.join(__dirname, 'dist')));

// // // DATABASE: read DATABASE_URL from env (Render provides it)
// // const pool = new Pool({
// //   connectionString: process.env.DATABASE_URL,
// //   // when needed in hosted envs, force SSL:
// //   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// // });

// // // --- In-memory promo map (literal JS map) ---
// // const promoCodes = {
// //   "SUMMER20": 0.20,
// //   "FIRST10": 0.10,
// //   "VIP25": 0.25,
// //   "SAVE10": 0.10,
// //   "FLAT100": 100,      // If you want mixed types, treat >1 as fixed amount in logic below
// // };

// // // --- Helper: map DB row to experience object ---
// // async function getExperienceById(id) {
// //   const res = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
// //   return res.rows[0] || null;
// // }

// // // --- GET /experiences ---
// // app.get('/experiences', async (req, res) => {
// //   try {
// //     const result = await pool.query('SELECT * FROM experiences ORDER BY id');
// //     res.json(result.rows);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'DB error' });
// //   }
// // });

// // // --- GET /experiences/:id?date=YYYY-MM-DD ---
// // // Returns experience details and timeslots for the requested date (defaults to today)
// // app.get('/experiences/:id', async (req, res) => {
// //   const { id } = req.params;
// //   const dateStr = req.query.date || (new Date()).toISOString().slice(0,10); // YYYY-MM-DD
// //   try {
// //     const exp = await getExperienceById(id);
// //     if (!exp) return res.status(404).json({ error: 'Not found' });

// //     const slotsRes = await pool.query(
// //       'SELECT id, time, total_spots, spots_left FROM timeslots WHERE experience_id = $1 AND date = $2 ORDER BY time',
// //       [id, dateStr]
// //     );
// //     return res.json({ experience: exp, date: dateStr, timeslots: slotsRes.rows });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'DB error' });
// //   }
// // });

// // // --- POST /promo/validate ---
// // // body: { code: "SUMMER20", price: 100 }  -> returns { valid: true, discountAmount, discountedPrice }
// // app.post('/promo/validate', (req, res) => {
// //   const { code, price } = req.body || {};
// //   if (!code) return res.status(400).json({ valid: false, message: 'Missing code' });
// //   const key = String(code).toUpperCase();
// //   if (!(key in promoCodes)) return res.json({ valid: false });

// //   const rule = promoCodes[key];
// //   let discountAmount = 0;
// //   if (typeof rule === 'number') {
// //     if (rule > 0 && rule <= 1 && typeof price === 'number') {
// //       discountAmount = price * rule;
// //     } else if (rule > 1) {
// //       // treat >1 as flat amount
// //       discountAmount = rule;
// //     }
// //   }

// //   return res.json({ valid: true, discountAmount, discountedPrice: typeof price === 'number' ? Math.max(0, price - discountAmount) : null });
// // });

// // // --- POST /bookings ---
// // // body:
// // // {
// // //   experience_id: "1",
// // //   timeslot_id: "1",
// // //   date: "2025-10-30",
// // //   time: "09:00 AM",
// // //   customer_name: "Alice",
// // //   customer_email: "a@b.com",
// // //   seats: 2,
// // //   promo_code: "SUMMER20"
// // // }
// // app.post('/bookings', async (req, res) => {
// //   const {
// //     experience_id,
// //     timeslot_id,
// //     date,
// //     time,
// //     customer_name,
// //     customer_email,
// //     seats = 1,
// //     promo_code
// //   } = req.body || {};

// //   // Basic validation
// //   if (!experience_id || !timeslot_id || !date || !time || !customer_name || !customer_email || !seats) {
// //     return res.status(400).json({ error: 'Missing required fields' });
// //   }
// //   if (seats <= 0 || seats > 100) return res.status(400).json({ error: 'Invalid seats count' });

// //   const client = await pool.connect();
// //   try {
// //     await client.query('BEGIN');

// //     // Lock the timeslot row for update to avoid race conditions
// //     const tsRes = await client.query(
// //       'SELECT id, spots_left FROM timeslots WHERE id = $1 AND experience_id = $2 AND date = $3 FOR UPDATE',
// //       [timeslot_id, experience_id, date]
// //     );
// //     const ts = tsRes.rows[0];
// //     if (!ts) {
// //       await client.query('ROLLBACK');
// //       return res.status(404).json({ error: 'Timeslot not found' });
// //     }
// //     if (ts.spots_left < seats) {
// //       await client.query('ROLLBACK');
// //       return res.status(409).json({ error: 'Not enough spots left' });
// //     }

// //     // Subtract spots
// //     const newLeft = ts.spots_left - seats;
// //     await client.query('UPDATE timeslots SET spots_left = $1 WHERE id = $2', [newLeft, timeslot_id]);

// //     // Insert booking
// //     const bookingId = uuidv4();
// //     await client.query(
// //       `INSERT INTO bookings (id, experience_id, timeslot_id, date, time, customer_name, customer_email, seats, promo_code)
// //        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
// //       [bookingId, experience_id, timeslot_id, date, time, customer_name, customer_email, seats, promo_code || null]
// //     );

// //     await client.query('COMMIT');

// //     return res.status(201).json({ bookingId, message: 'Booking confirmed', spotsLeft: newLeft });
// //   } catch (err) {
// //     await client.query('ROLLBACK');
// //     console.error('Booking error', err);
// //     return res.status(500).json({ error: 'Booking failed' });
// //   } finally {
// //     client.release();
// //   }
// // });

// // // Health / simple index
// // app.get('/', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'dist','index.html'));
// // });

// // // Start
// // const port = process.env.PORT || 3000;
// // app.listen(port, () => {
// //   console.log(`Server listening on ${port}`);
// // });