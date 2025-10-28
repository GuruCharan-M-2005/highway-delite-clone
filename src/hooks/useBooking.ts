import { create } from "zustand";
import { BookingDetails, UserInfo } from "@/types/booking";

interface BookingStore {
  bookingDetails: Partial<BookingDetails>;
  userInfo: Partial<UserInfo>;
  promoCode: string;

  // setters
  setBookingDetails: (details: Partial<BookingDetails>) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setPromoCode: (code: string) => void;

  // helpers
  resetBooking: () => void;

  // optional backend actions (to be implemented)
  submitBooking?: () => Promise<void>;
  validatePromo?: () => Promise<void>;
}

/**
 * Zustand store for managing booking flow.
 * Stores the currently selected experience, time slot, and user info.
 */
export const useBooking = create<BookingStore>((set, get) => ({
  bookingDetails: {},
  userInfo: {},
  promoCode: "",

  setBookingDetails: (details) =>
    set((state) => ({
      bookingDetails: { ...state.bookingDetails, ...details },
    })),

  setUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info },
    })),

  setPromoCode: (code) => set({ promoCode: code }),

  resetBooking: () =>
    set({
      bookingDetails: {},
      userInfo: {},
      promoCode: "",
    }),

  /**
   * Future: submit booking to backend
   * POST /bookings
   */
  submitBooking: async () => {
    const { bookingDetails, userInfo, promoCode } = get();

    if (!bookingDetails.experience_id || !userInfo.email || !userInfo.name) {
      console.error("Missing required booking info");
      return;
    }

    try {
      const response = await fetch("/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingDetails,
          ...userInfo,
          promoCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Booking confirmed:", data);
        get().resetBooking();
      } else {
        console.error("Booking failed:", data.error);
      }
    } catch (err) {
      console.error("Booking request failed:", err);
    }
  },

  /**
   * Future: validate promo code with backend
   * POST /promo/validate
   */
  validatePromo: async () => {
    const { promoCode } = get();
    if (!promoCode) return;

    try {
      const res = await fetch("/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Promo valid:", data);
      } else {
        console.warn("Invalid promo code");
      }
    } catch (err) {
      console.error("Promo validation failed:", err);
    }
  },
}));


