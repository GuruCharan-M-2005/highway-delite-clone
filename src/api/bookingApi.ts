export interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  spots_left: number;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function getExperiences(): Promise<Experience[]> {
  const res = await fetch(`${API_BASE}/api/experiences`);
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
}

export async function getExperience(id: string, date?: string) {
  const res = await fetch(`${API_BASE}/api/experiences/${id}?date=${date || new Date().toISOString().slice(0, 10)}`);
  if (!res.ok) throw new Error("Failed to fetch experience");
  return res.json();
}

export async function createBooking(data: {
  experience_id: string;
  timeslot_id: string;
  date: string;
  time: string;
  customer_name: string;
  customer_email: string;
  seats: number;
}) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
 




// src/api/bookingApi.ts

// export interface Experience {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   image: string;
//   duration: string;
//   location: string;
//   rating: number;
//   reviews: number;
// }

// export interface TimeSlot {
//   id: string;
//   time: string;
//   spots_left: number;
// }

// export interface BookingResponse {
//   bookingId: string;
//   message: string;
// }

// const API_BASE = import.meta.env.VITE_API_URL || ''; // blank = same origin (Render setup)

// export async function getExperiences(): Promise<Experience[]> {
//   const res = await fetch(`${API_BASE}/api/experiences`);
//   if (!res.ok) throw new Error('Failed to fetch experiences');
//   return res.json();
// }

// export async function getExperienceById(id: string, date?: string) {
//   const res = await fetch(`${API_BASE}/api/experiences/${id}?date=${date || new Date().toISOString().slice(0, 10)}`);
//   if (!res.ok) throw new Error('Failed to fetch experience');
//   return res.json();
// }

// export async function createBooking(data: {
//   experience_id: string;
//   timeslot_id: string;
//   date: string;
//   time: string;
//   customer_name: string;
//   customer_email: string;
//   seats: number;
//   promo_code?: string;
// }): Promise<BookingResponse> {
//   const res = await fetch(`${API_BASE}/api/bookings`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error('Booking failed');
//   return res.json();
// }

// export async function validatePromo(code: string, price: number) {
//   const res = await fetch(`${API_BASE}/api/promo/validate`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code, price }),
//   });
//   return res.json();
// }
