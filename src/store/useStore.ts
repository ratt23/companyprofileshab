/// <reference types="vite/client" />
import { create } from "zustand";
import { DatabaseState, Doctor, YearStats, SlideConfigItem } from "../types";
import { defaultDatabaseState } from "../default_data_payload";

interface SlideState {
  dbState: DatabaseState;
  currentSlideIndex: number;
  isPlaying: boolean;
  isFullscreen: boolean;
  loading: boolean;
  showRoster: boolean;
  slideConfig: SlideConfigItem[];
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
  setSlideConfig: (config: SlideConfigItem[]) => void;

  // Operations
  loadDatabase: () => Promise<void>;
  updateDatabase: (newDoctors: Doctor[], newStats: YearStats[]) => Promise<void>;
  updateSlideConfig: (config: SlideConfigItem[]) => Promise<void>;
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
  slideConfig: [],
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
  setSlideConfig: (slideConfig) => set({ slideConfig }),

  loadDatabase: async () => {
    set({ loading: true });
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/data`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.doctors) {
          // Filter out disabled doctors client-side using doctorOrder
          let activeDoctors = data.doctors;
          if (data.doctorOrder && data.doctorOrder.length > 0) {
            const disabledIds = new Set(
              data.doctorOrder.filter((item: any) => item.enabled === false).map((item: any) => item.id)
            );
            activeDoctors = data.doctors.filter((d: any) => !disabledIds.has(d.id));
          }

          set({
            dbState: {
              doctors: activeDoctors && activeDoctors.length > 0 ? activeDoctors : defaultDatabaseState.doctors,
              stats: data.stats && data.stats.length > 0 ? data.stats : defaultDatabaseState.stats,
              statsMeta: data.statsMeta || defaultDatabaseState.statsMeta,
              facilities: data.facilities && data.facilities.length > 0 ? data.facilities : defaultDatabaseState.facilities,
              cover: data.cover || defaultDatabaseState.cover,
              excellence: data.excellence || defaultDatabaseState.excellence,
              clinic: data.clinic || defaultDatabaseState.clinic,
              equipments: data.equipments || defaultDatabaseState.equipments,
              plan: data.plan || defaultDatabaseState.plan,
              socials: data.socials || defaultDatabaseState.socials,
              slideConfig: data.slideConfig || undefined,
            },
            // Also restore slideConfig into store state
            slideConfig: data.slideConfig || [],
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
    const { dbState, slideConfig } = get();
    const updatedState: DatabaseState = {
      ...dbState,
      doctors: newDoctors,
      stats: newStats,
      slideConfig: slideConfig.length > 0 ? slideConfig : dbState.slideConfig,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/data`, {
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

  updateSlideConfig: async (config: SlideConfigItem[]) => {
    const { dbState } = get();
    const updatedState: DatabaseState = {
      ...dbState,
      slideConfig: config,
    };
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedState),
      });
      if (!response.ok) throw new Error("Failed to update slide config");
      set({ dbState: updatedState, slideConfig: config });
    } catch (err) {
      console.error("Error saving slide config:", err);
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
