/// <reference types="vite/client" />
import { create } from "zustand";
import { DatabaseState, Doctor, YearStats } from "../types";
import { defaultDatabaseState } from "../default_data_payload";

interface SlideState {
  dbState: DatabaseState;
  currentSlideIndex: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  loading: boolean;
  showRoster: boolean;
  socialRealtimeData: {
    google: { rating: number; reviewsCount: string; status: string };
    instagram: Array<{ id: string; media_url: string; caption: string }>;
  } | null;

  // Setters
  setDbState: (dbState: DatabaseState) => void;
  setCurrentSlideIndex: (index: number) => void;
  setIsPlaying: (isPlaying: boolean | ((prev: boolean) => boolean)) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setShowRoster: (showRoster: boolean | ((prev: boolean) => boolean)) => void;

  // Operations
  loadDatabase: () => Promise<void>;
  updateDatabase: (newDoctors: Doctor[], newStats: YearStats[]) => Promise<void>;
  fetchSocialStats: () => Promise<void>;
  nextSlide: (totalSlides: number) => void;
  prevSlide: (totalSlides: number) => void;
}

export const useSlideStore = create<SlideState>((set, get) => ({
  dbState: defaultDatabaseState,
  currentSlideIndex: 0,
  isPlaying: false,
  isFullscreen: false,
  loading: true,
  showRoster: false,
  socialRealtimeData: null,

  setDbState: (dbState) => set({ dbState }),
  setCurrentSlideIndex: (currentSlideIndex) => set({ currentSlideIndex }),
  setIsPlaying: (isPlaying) =>
    set((state) => ({
      isPlaying: typeof isPlaying === "function" ? isPlaying(state.isPlaying) : isPlaying,
    })),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setLoading: (loading) => set({ loading }),
  setShowRoster: (showRoster) =>
    set((state) => ({
      showRoster: typeof showRoster === "function" ? showRoster(state.showRoster) : showRoster,
    })),

  loadDatabase: async () => {
    set({ loading: true });
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dashdev2.netlify.app/.netlify/functions/api';
      const response = await fetch(`${baseUrl}/company-profile/data`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.doctors) {
          set({
            dbState: {
              doctors: data.doctors && data.doctors.length > 0 ? data.doctors : defaultDatabaseState.doctors,
              stats: data.stats && data.stats.length > 0 ? data.stats : defaultDatabaseState.stats,
              facilities: data.facilities && data.facilities.length > 0 ? data.facilities : defaultDatabaseState.facilities,
              cover: data.cover || defaultDatabaseState.cover,
              excellence: data.excellence || defaultDatabaseState.excellence,
              clinic: data.clinic || defaultDatabaseState.clinic,
              equipments: data.equipments || defaultDatabaseState.equipments,
              plan: data.plan || defaultDatabaseState.plan,
              socials: data.socials || defaultDatabaseState.socials,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Could not connect to live API, using offline default state:", err);
    } finally {
      set({ loading: false });
    }
  },

  updateDatabase: async (newDoctors: Doctor[], newStats: YearStats[]) => {
    const { dbState } = get();
    const updatedState: DatabaseState = {
      ...dbState,
      doctors: newDoctors,
      stats: newStats,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dashdev2.netlify.app/.netlify/functions/api';
      const response = await fetch(`${baseUrl}/company-profile/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedState),
      });

      if (!response.ok) {
        throw new Error("Failed to update remote database");
      }

      // Sync local state as well
      set({ dbState: updatedState });
    } catch (err) {
      console.error("Error updating database:", err);
      throw err;
    }
  },

  fetchSocialStats: async () => {
    try {
      // Endpoint internal backend (server.ts) yang kita buat
      const response = await fetch("/api/social-stats");
      if (response.ok) {
        const data = await response.json();
        set({ socialRealtimeData: data });
      }
    } catch (error) {
      console.error("Gagal menarik data social realtime:", error);
    }
  },

  nextSlide: (totalSlides) => {
    set((state) => ({
      currentSlideIndex: state.currentSlideIndex < totalSlides - 1 ? state.currentSlideIndex + 1 : 0,
    }));
  },

  prevSlide: (totalSlides) => {
    set((state) => ({
      currentSlideIndex: state.currentSlideIndex > 0 ? state.currentSlideIndex - 1 : totalSlides - 1,
    }));
  },
}));
