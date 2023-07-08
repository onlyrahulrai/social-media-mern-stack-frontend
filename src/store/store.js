import { create } from "zustand";

export const useAuthStore = create((set) => ({
  auth: null,
  socket: null,
  notifications:[],
  setState: (data) =>
    set((state) => {
      return { ...state, ...data };
    }),
  setAuth: (data) =>
    set((state) => {
      return { ...state, auth: data };
    }),
}));

export const useLayoutStore = create((set) => ({
  loading: false,
  setLoading: (value) =>
    set((state) => {
      return { ...state, loading: value };
    }),
}));
