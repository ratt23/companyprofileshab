import React, { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Doctor, YearStats, HospitalFacility, DatabaseState, SlideConfigItem } from "./types";
import { SlideCover } from "./components/SlideCover";
import { SlideExcelence } from "./components/SlideExcelence";
import { SlideStats } from "./components/SlideStats";
import { SlideFacilities } from "./components/SlideFacilities";
import { SlideClinic } from "./components/SlideClinic";
import { SlideEquipments } from "./components/SlideEquipments";
import { SlidePlan } from "./components/SlidePlan";
import { SlideDoctors } from "./components/SlideDoctors";
import { SlideSocialMedia } from "./components/SlideSocialMedia";
import { RosterView } from "./components/RosterView";
import { AdminPanel } from "./components/AdminPanel";
import { useSlideStore } from "./store/useStore";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Database,
  Settings,
  Tv,
  Users,
  RefreshCw
} from "lucide-react";

interface DynamicSlide {
  title: string;
  doctors: Doctor[];
}

const generateDynamicSlides = (doctors: Doctor[]): DynamicSlide[] => {
  // Preserve the order of doctors as they come from the API (which respects doctorOrder).
  // Group by specialty but maintain insertion order of first appearance of each specialty.
  const grouped: Record<string, Doctor[]> = {};
  const specialtyOrder: string[] = [];

  doctors.forEach(d => {
    const spec = d.specialty || "Dokter Umum";
    if (!grouped[spec]) {
      grouped[spec] = [];
      specialtyOrder.push(spec); // first appearance of this specialty
    }
    grouped[spec].push(d);
  });

  const slides: DynamicSlide[] = [];

  // Use specialtyOrder (insertion order = doctorOrder from API) instead of sort()
  specialtyOrder.forEach(spec => {
    const list = grouped[spec];
    for (let i = 0; i < list.length; i += 3) {
      slides.push({
        title: spec.toUpperCase(),
        doctors: list.slice(i, i + 3)
      });
    }
  });

  return slides;
};


// The default/canonical ordered slide config items
// This is used to generate the default slideConfig if none is stored
const buildDefaultSlideConfig = (dynamicDoctorSlides: DynamicSlide[]): SlideConfigItem[] => [
  { id: "cover", label: "Cover Slide – Sambutan RSU Siloam", enabled: true },
  { id: "excellence", label: "Center of Excellence (Layanan Unggulan)", enabled: true },
  { id: "stats", label: "Tren Statistik Kunjungan Pasien", enabled: true },
  { id: "facilities-1", label: "Layanan: IGD 24 Jam & Siloam at Home", enabled: true },
  { id: "facilities-2", label: "Layanan: Radiologi & Rawat Jalan", enabled: true },
  { id: "facilities-3", label: "Layanan: Rawat Inap & Ambulans Rescue", enabled: true },
  { id: "facilities-4", label: "Bangsal Terintegrasi: Kamar VVIP, VIP, Kelas I", enabled: true },
  { id: "facilities-5", label: "Bangsal Terintegrasi: Kamar Kelas II & III", enabled: true },
  { id: "clinic", label: "Executive Clinic: Lobby Premium & Lounge", enabled: true },
  { id: "equipments-1", label: "Alat Tinggi: ESWL & PCNL Urologi", enabled: true },
  { id: "equipments-2", label: "Alat Tinggi: C-Arm & CT Scan Diagnostik", enabled: true },
  { id: "equipments-3", label: "Alat Tinggi: Bedah Phaco & Mikroskop Bedah", enabled: true },
  { id: "plan", label: "Future Plan: Rencana Kerja Jangka Panjang", enabled: true },
  {
    id: "doctors",
    label: `Dokter Spesialis (${dynamicDoctorSlides.length} halaman – dikelompokkan per spesialisasi)`,
    enabled: true,
    isDynamic: true
  },
  { id: "socials", label: "Connect: Media Sosial RSU Siloam Ambon", enabled: true },
];

// Map a slide config ID to the actual JSX component
type RenderArgs = {
  dynamicDoctorSlides: DynamicSlide[];
  dbState: DatabaseState;
  totalPages: number;
};

const renderSlideById = (
  id: string,
  args: RenderArgs
): React.ReactNode | null => {
  const { dynamicDoctorSlides, dbState, totalPages } = args;

  if (id === "cover") return <SlideCover data={dbState.cover} />;
  if (id === "excellence") return <SlideExcelence data={dbState.excellence} />;
  if (id === "stats") return <SlideStats stats={dbState.stats} />;
  if (id === "facilities-1") return <SlideFacilities page={1} facilities={dbState.facilities} />;
  if (id === "facilities-2") return <SlideFacilities page={2} facilities={dbState.facilities} />;
  if (id === "facilities-3") return <SlideFacilities page={3} facilities={dbState.facilities} />;
  if (id === "facilities-4") return <SlideFacilities page={4} facilities={dbState.facilities} />;
  if (id === "facilities-5") return <SlideFacilities page={5} facilities={dbState.facilities} />;
  if (id === "clinic") return <SlideClinic data={dbState.clinic} />;
  if (id === "equipments-1") return <SlideEquipments page={1} data={dbState.equipments} />;
  if (id === "equipments-2") return <SlideEquipments page={2} data={dbState.equipments} />;
  if (id === "equipments-3") return <SlideEquipments page={3} data={dbState.equipments} />;
  if (id === "plan") return <SlidePlan data={dbState.plan} />;
  if (id === "socials") return <SlideSocialMedia data={dbState.socials} />;

  // Dynamic doctor slide IDs: "doctors-0", "doctors-1", etc.
  if (id.startsWith("doctors-")) {
    const pageIdx = parseInt(id.split("-")[1]);
    const docSlide = dynamicDoctorSlides[pageIdx];
    if (docSlide) {
      return (
        <SlideDoctors
          title={docSlide.title}
          doctors={docSlide.doctors}
          pageNumber={pageIdx + 1}
          totalPages={totalPages}
        />
      );
    }
  }

  return null;
};

export default function App() {
  const {
    dbState,
    currentSlideIndex,
    isPlaying,
    isFullscreen,
    loading,
    showRoster,
    slideConfig,
    setCurrentSlideIndex,
    setIsPlaying,
    setIsFullscreen,
    setShowRoster,
    setSlideConfig,
    loadDatabase,
    updateDatabase,
    updateSlideConfig,
    nextSlide,
    prevSlide
  } = useSlideStore();

  const [showAdmin, setShowAdmin] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live database statistics and doctor schedules on boot
  useEffect(() => {
    loadDatabase();
  }, [loadDatabase]);

  const dynamicDoctorSlides = useMemo(
    () => generateDynamicSlides(dbState.doctors),
    [dbState.doctors]
  );

  // Expand "doctors" group into individual doctor slide entries
  const expandedSlideConfig = useMemo((): SlideConfigItem[] => {
    const defaultConfig = buildDefaultSlideConfig(dynamicDoctorSlides);

    // Use stored config if available; else use default
    const storedConfig = slideConfig.length > 0 ? slideConfig : (dbState.slideConfig && dbState.slideConfig.length > 0 ? dbState.slideConfig : []);

    // If no stored config, generate default and save to store
    if (storedConfig.length === 0) {
      setSlideConfig(defaultConfig);
      // Expand doctors group into individual slides
      return expandDoctorsGroup(defaultConfig, dynamicDoctorSlides);
    }

    return expandDoctorsGroup(storedConfig, dynamicDoctorSlides);
  }, [slideConfig, dbState.slideConfig, dynamicDoctorSlides]);

  // Compute slide config for AdminPanel (grouped, not expanded)
  const adminSlideConfig = useMemo((): SlideConfigItem[] => {
    if (slideConfig.length > 0) return slideConfig;
    if (dbState.slideConfig && dbState.slideConfig.length > 0) return dbState.slideConfig;
    return buildDefaultSlideConfig(dynamicDoctorSlides);
  }, [slideConfig, dbState.slideConfig, dynamicDoctorSlides]);

  // Only show enabled slides
  const activeSlides = useMemo(
    () => expandedSlideConfig.filter(s => s.enabled),
    [expandedSlideConfig]
  );

  const totalSlides = activeSlides.length;

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        showRoster ||
        showAdmin
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        nextSlide(totalSlides);
        setIsPlaying(false);
      } else if (e.key === "ArrowLeft") {
        prevSlide(totalSlides);
        setIsPlaying(false);
      } else if (e.key === " " || e.key === "Enter") {
        setIsPlaying(prev => !prev);
      } else if (e.key === "r" || e.key === "R") {
        setShowRoster(prev => !prev);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlideIndex, showRoster, showAdmin, totalSlides, nextSlide, prevSlide, setIsPlaying, setShowRoster]);

  // Autoplay
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide(totalSlides);
      }, 8000);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentSlideIndex, totalSlides, nextSlide]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Render current slide content based on activeSlides order
  const renderSlideContent = () => {
    const currentSlide = activeSlides[currentSlideIndex];
    if (!currentSlide) return <SlideCover data={dbState.cover} />;

    const content = renderSlideById(currentSlide.id, {
      dynamicDoctorSlides,
      dbState,
      totalPages: totalSlides,
    });

    return content || <SlideCover data={dbState.cover} />;
  };

  // Build the dropdown catalog from active slides
  const slideCatalog = activeSlides.map((slide, idx) => ({
    id: idx,
    label: `${idx + 1}. ${slide.label}`
  }));

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between bg-slate-950 font-sans text-white select-none relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#003399]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b0841a]/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Primary Top Action Bar */}
      <header className="w-full bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 px-6 py-3 shrink-0 flex justify-between items-center z-30">
        <div className="flex items-center space-x-3">
          <Tv className="w-5 h-5 text-amber-500" />
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              RSU Siloam Ambon
            </span>
            <span className="text-[10px] ml-2 font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/30">
              ● LIVE PRESENTER ACTIVE
            </span>
          </div>
        </div>

        {/* Presenter Database Query Tools & Locks */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setShowRoster(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-[#003399] rounded-xl text-xs font-bold leading-none flex items-center space-x-1.5 transition-all text-slate-200 border border-slate-700/50 shadow"
          >
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Cari Roster Dokter ({dbState.doctors.length})</span>
          </button>

          <button
            onClick={() => setShowAdmin(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-amber-700 rounded-xl text-xs font-bold leading-none flex items-center space-x-1.5 transition-all text-slate-200 border border-slate-700/50 shadow"
          >
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            <span>Dashboard Admin</span>
          </button>

        </div>
      </header>

      {/* Main Slide Deck Canvas */}
      <main className="flex-grow w-full flex items-center justify-center p-4">
        {loading ? (
          <div className="text-center space-y-3">
            <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
            <p className="text-slate-400 text-xs font-mono">Menyiapkan Database Slide RSU Siloam...</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`w-full max-w-5xl aspect-[16/9] bg-white rounded-3xl shadow-2xl shadow-blue-900/30 overflow-hidden relative border border-slate-800/10 flex flex-col justify-between transition-all ${
              isFullscreen ? "cursor-pointer" : ""
            }`}
            onClick={isFullscreen ? (e) => {
              if (e.button === 0) {
                const target = e.target as HTMLElement;
                if (
                  target.tagName === "BUTTON" ||
                  target.tagName === "INPUT" ||
                  target.tagName === "SELECT" ||
                  target.tagName === "TEXTAREA" ||
                  target.closest("button") ||
                  target.closest("a")
                ) {
                  return;
                }
                nextSlide(totalSlides);
                setIsPlaying(false);
              }
            } : undefined}
            onContextMenu={isFullscreen ? (e) => {
              e.preventDefault();
              prevSlide(totalSlides);
              setIsPlaying(false);
            } : undefined}
          >
            {/* Global Animated Background waves */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
              <svg className="w-[120%] h-[120%] -translate-x-[10%] -translate-y-[10%]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path className="animate-wave-1" d="M-100 650 C 400 450, 800 650, 1600 350" stroke="url(#wave-grad-1)" strokeWidth="2" />
                <path className="animate-wave-2" d="M-100 600 C 350 500, 750 500, 1600 400" stroke="url(#wave-grad-1)" strokeWidth="1.5" />
                <path className="animate-wave-3" d="M-100 550 C 300 550, 700 450, 1600 450" stroke="url(#wave-grad-1)" strokeWidth="1" />
                <path className="animate-wave-1" d="M-100 500 C 250 600, 650 400, 1600 500" stroke="url(#wave-grad-2)" strokeWidth="0.8" />
                <path className="animate-wave-2" d="M-100 450 C 200 650, 600 350, 1600 550" stroke="url(#wave-grad-2)" strokeWidth="1.2" />
                <defs>
                  <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a3994" />
                    <stop offset="100%" stopColor="#75a4ff" />
                  </linearGradient>
                  <linearGradient id="wave-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e58c7" />
                    <stop offset="100%" stopColor="#eef4ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Animated slide transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {renderSlideContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer navigation */}
      <footer className="w-full bg-slate-900/60 backdrop-blur-md border-t border-slate-800/50 px-6 py-4 shrink-0 flex flex-col md:flex-row justify-between items-center z-30 space-y-3 md:space-y-0 text-xs">
        
        {/* Slide picker dropdown */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-widest font-mono">Slide:</span>
          <select
            value={currentSlideIndex}
            onChange={(e) => {
              setCurrentSlideIndex(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-200 outline-none w-full md:w-72"
          >
            {slideCatalog.map(slide => (
              <option key={slide.id} value={slide.id}>
                {slide.label}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700/50">
            <button
              onClick={() => { prevSlide(totalSlides); setIsPlaying(false); }}
              title="Prev Slide (Left Arrow)"
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Slideshow Auto-play" : "Play Autoplay Loop"}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isPlaying ? "bg-amber-600 text-white" : "hover:bg-slate-700 text-slate-300"
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Autoplay ON (8s)" : "Play Auto"}</span>
            </button>

            <button
              onClick={() => { nextSlide(totalSlides); setIsPlaying(false); }}
              title="Next Slide (Right Arrow / Space)"
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            title="Toggle fullscreen deck (F)"
            className="p-2 bg-slate-800 border border-slate-705/10 rounded-xl hover:bg-slate-700 transition-all text-slate-300 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Paging info */}
        <div className="text-slate-500 font-mono font-bold text-[10px] tracking-wider">
          SLIDES DECK PAGING: <span className="text-slate-300">{currentSlideIndex + 1}</span> / {totalSlides}
          {activeSlides.length < expandedSlideConfig.length && (
            <span className="ml-2 text-amber-500">
              ({expandedSlideConfig.length - activeSlides.length} disembunyikan)
            </span>
          )}
        </div>

      </footer>

      {/* Floating Database Search Roster Overlay */}
      {showRoster && (
        <RosterView
          doctors={dbState.doctors}
          onClose={() => setShowRoster(false)}
        />
      )}

      {/* Admin Panel Overlay */}
      {showAdmin && (
        <AdminPanel
          doctors={dbState.doctors}
          stats={dbState.stats}
          slideConfig={adminSlideConfig}
          onUpdateData={updateDatabase}
          onUpdateSlideConfig={updateSlideConfig}
          onClose={() => setShowAdmin(false)}
        />
      )}

    </div>
  );
}

// Helper: expand "doctors" group into individual slide entries
function expandDoctorsGroup(
  config: SlideConfigItem[],
  dynamicDoctorSlides: DynamicSlide[]
): SlideConfigItem[] {
  const result: SlideConfigItem[] = [];
  for (const item of config) {
    if (item.id === "doctors") {
      // Expand into one entry per dynamic doctor slide
      dynamicDoctorSlides.forEach((docSlide, idx) => {
        result.push({
          id: `doctors-${idx}`,
          label: `Dokter: ${docSlide.title}`,
          enabled: item.enabled,
          isDynamic: true,
        });
      });
    } else {
      result.push(item);
    }
  }
  return result;
}
