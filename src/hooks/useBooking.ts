import { create } from 'zustand';
import { Booking, BookingDetails, UserInfo } from '@/types/booking';

interface BookingStore {
  bookingDetails: Partial<BookingDetails>;
  userInfo: Partial<UserInfo>;
  promoCode: string;
  setBookingDetails: (details: Partial<BookingDetails>) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setPromoCode: (code: string) => void;
  resetBooking: () => void;
}

export const useBooking = create<BookingStore>((set) => ({
  bookingDetails: {},
  userInfo: {},
  promoCode: '',
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
      promoCode: '',
    }),
}));
