
// server.js
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized:false } : false });

// Paste your mockExperiences array and generateTimeSlots function here:
const mockExperiences = [ 
  {
    id: "1",
    title: "Sunset Beach Yoga",
    description: "Relax and rejuvenate with a peaceful yoga session on the beach as the sun sets over the ocean.",
    price: 45,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    duration: "1.5 hours",
    location: "Santa Monica Beach",
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2",
    title: "Mountain Hiking Adventure",
    description: "Explore scenic mountain trails with an experienced guide. Perfect for nature lovers.",
    price: 75,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    duration: "4 hours",
    location: "Blue Ridge Mountains",
    rating: 4.9,
    reviews: 89
  },
  {
    id: "3",
    title: "City Food Tour",
    description: "Discover hidden culinary gems and taste authentic local cuisine on this guided food tour.",
    price: 65,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    duration: "3 hours",
    location: "Downtown District",
    rating: 4.7,
    reviews: 156
  },
  {
    id: "4",
    title: "Sunset Sailing Experience",
    description: "Sail into the sunset on a private yacht with champagne and stunning coastal views.",
    price: 120,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    duration: "2 hours",
    location: "Marina Bay",
    rating: 5.0,
    reviews: 73
  },
  {
    id: "5",
    title: "Photography Walking Tour",
    description: "Capture the city's beauty through your lens with tips from a professional photographer.",
    price: 55,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop",
    duration: "2.5 hours",
    location: "Historic Quarter",
    rating: 4.6,
    reviews: 92
  },
  {
    id: "6",
    title: "Wine Tasting Experience",
    description: "Sample premium wines and learn about winemaking from expert sommeliers.",
    price: 85,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop",
    duration: "2 hours",
    location: "Napa Valley Vineyard",
    rating: 4.9,
    reviews: 134
  } ];

const generateTimeSlots = (dateStr) => ([
  { id: 'TS-'+dateStr+'-1', time: '09:00 AM', available: true, spotsLeft: 8, total: 8 },
  { id: 'TS-'+dateStr+'-2', time: '11:00 AM', available: true, spotsLeft: 5, total: 5 },
  { id: 'TS-'+dateStr+'-3', time: '02:00 PM', available: true, spotsLeft: 12, total: 12 },
  { id: 'TS-'+dateStr+'-4', time: '04:00 PM', available: false, spotsLeft: 0, total: 0 },
  { id: 'TS-'+dateStr+'-5', time: '06:00 PM', available: true, spotsLeft: 3, total: 3 },
]);

(async () => {
  try {
    for (const e of mockExperiences) {
      await pool.query(
        `INSERT INTO experiences (id, title, description, price, image, duration, location, rating, reviews)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [e.id, e.title, e.description, e.price, e.image, e.duration, e.location, e.rating, e.reviews]
      );
    }

    // seed timeslots for next 7 days
    const today = new Date();
    for (let d=0; d<7; d++) {
      const day = new Date(today);
      day.setDate(today.getDate() + d);
      const dateStr = day.toISOString().slice(0,10);
      for (const e of mockExperiences) {
        const slots = generateTimeSlots(dateStr);
        for (const s of slots) {
          await pool.query(
            `INSERT INTO timeslots (id, experience_id, date, time, total_spots, spots_left)
             VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
            [s.id + '-' + e.id, e.id, dateStr, s.time, s.spotsLeft, s.spotsLeft]
          );
        }
      }
    }

    console.log('Seeded.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
