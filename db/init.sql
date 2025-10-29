CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- db/init.sql

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  duration TEXT,
  location TEXT,
  rating NUMERIC(3,2),
  reviews INTEGER
);

CREATE TABLE IF NOT EXISTS  timeslots (
  id TEXT PRIMARY KEY,
  experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  total_spots INTEGER NOT NULL,
  spots_left INTEGER NOT NULL,
  UNIQUE(experience_id, date, time)
);

CREATE TABLE IF NOT EXISTS  bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id TEXT NOT NULL REFERENCES experiences(id),
  timeslot_id TEXT NOT NULL REFERENCES timeslots(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  seats INTEGER NOT NULL CHECK (seats > 0),
  promo_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional index to speed up double-book queries
CREATE INDEX IF NOT EXISTS  idx_bookings_timeslot ON bookings(timeslot_id, date);
