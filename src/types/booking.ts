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

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  spotsLeft: number;
}

export interface BookingDetails {
  experienceId: string;
  date: Date;
  timeSlot: string;
  guests: number;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Booking extends BookingDetails, UserInfo {
  promoCode?: string;
  totalPrice: number;
  bookingId?: string;
}
