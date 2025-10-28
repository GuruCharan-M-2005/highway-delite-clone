import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { exec } from "child_process";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDatabase() {
  try {
    const initSql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");
    await pool.query(initSql);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

async function seedDatabase() {
  try {
    const seedScript = path.join(__dirname, "seed.js");
    await new Promise((resolve, reject) => {
      exec(`node ${seedScript}`, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Seed error:", stderr);
          reject(error);
        } else {
          console.log(stdout);
          resolve(stdout);
        }
      });
    });
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
}

(async () => {
  await initDatabase();
  await seedDatabase();
  await pool.end();
})();
