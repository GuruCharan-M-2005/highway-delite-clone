/**
 * Represents a single experience (from /experiences endpoint)
 */
export interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  location: string;
  rating: number;
  reviews: number;
}

/**
 * Represents a single available time slot for an experience.
 */
export interface TimeSlot {
  id: string;
  time: string;          // e.g., "09:00 AM"
  available: boolean;
  spotsLeft: number;     // remaining seats
}

/**
 * Booking details selected by the user before confirming.
 * These will be sent to POST /bookings.
 */
export interface BookingDetails {
  experience_id: string; // matches backend DB field
  date: string;          // ISO string (yyyy-mm-dd)
  time: string;  // reference to selected slot
  guests: number;        // number of participants
}

/**
 * Basic user info collected at checkout.
 */
export interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Represents a confirmed booking record.
 * Extends both BookingDetails + UserInfo, and includes computed totals.
 */
export interface Booking extends BookingDetails, UserInfo {
  promoCode?: string;
  totalPrice: number;
  bookingId?: string;
}

