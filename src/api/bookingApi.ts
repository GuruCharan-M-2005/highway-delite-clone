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
 