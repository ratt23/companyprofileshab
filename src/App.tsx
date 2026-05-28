import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Doctor, YearStats, HospitalFacility, DatabaseState } from "./types";
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
import { useSlideStore } from "./store/useStore";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Database,
  Search,
  Settings,
  Tv,
  Users,
  Info,
  CalendarDays,
  RefreshCw
} from "lucide-react";

interface DynamicSlide {
  title: string;
  doctors: Doctor[];
}

const generateDynamicSlides = (doctors: Doctor[]): DynamicSlide[] => {
  const grouped: Record<string, Doctor[]> = {};
  doctors.forEach(d => {
    const spec = d.specialty || "Dokter Umum";
    if (!grouped[spec]) grouped[spec] = [];
    grouped[spec].push(d);
  });

  const sortedSpecs = Object.keys(grouped).sort();
  const slides: DynamicSlide[] = [];

  sortedSpecs.forEach(spec => {
    const list = grouped[spec];
    // Maximum 3 doctors per slide for optimal viewing
    for (let i = 0; i < list.length; i += 3) {
      slides.push({
        title: spec.toUpperCase(),
        doctors: list.slice(i, i + 3)
      });
    }
  });

  return slides;
};

export default function App() {
  const {
    dbState,
    currentSlideIndex,
    isPlaying,
    isFullscreen,
    loading,
    showRoster,
    setCurrentSlideIndex,
    setIsPlaying,
    setIsFullscreen,
    setShowRoster,
    loadDatabase,
    nextSlide,
    prevSlide
  } = useSlideStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live database statistics and doctor schedules on boot
  useEffect(() => {
    loadDatabase();
  }, [loadDatabase]);

  const dynamicDoctorSlides = generateDynamicSlides(dbState.doctors);
  const totalSlides = 13 + dynamicDoctorSlides.length + 1;

  // Keyboard Navigation: support Space/Right/Down for Next, Left/Up for Prev
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: do not capture triggers if modifying text fields in modals
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        showRoster
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        nextSlide(totalSlides);
        setIsPlaying(false); // Auto-pause on manual intervention
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
  }, [currentSlideIndex, showRoster, totalSlides, nextSlide, prevSlide, setIsPlaying, setShowRoster]);

  // Handle Autoplay Slideshow Player
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide(totalSlides);
      }, 8000); // 8 seconds per slide change
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

  // Monitor browser exit-fullscreen triggers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  const baseSlides = [
    { id: 0, label: "1. Cover Slide - Sambutan RSU Siloam" },
    { id: 1, label: "2. Center of Excellence (Layanan Unggulan)" },
    { id: 2, label: "3. Tren Statistik Kunjungan Pasien (Recharts)" },
    { id: 3, label: "4. Layanan: IGD 24 Jam & Siloam at Home" },
    { id: 4, label: "5. Layanan: Radiologi & Rawat Jalan" },
    { id: 5, label: "6. Layanan: Rawat Inap & Ambulans Rescue" },
    { id: 6, label: "7. Bangsal Terintegrasi: Kamar VVIP, VIP, Kelas I" },
    { id: 7, label: "8. Bangsal Terintegrasi: Kamar Kelas II & Kelas III" },
    { id: 8, label: "9. Executive Clinic: Lobby Premium & Lounge" },
    { id: 9, label: "10. Alat Tinggi: ESWL & PCNL Urologi" },
    { id: 10, label: "11. Alat Tinggi: C-Arm & CT Scan Diagnostik" },
    { id: 11, label: "12. Alat Tinggi: Bedah Phaco & Mikroskop Bedah" },
    { id: 12, label: "13. Future Plan: Rencana Kerja Jangka Panjang" }
  ];

  const slideCatalog = [
    ...baseSlides,
    ...dynamicDoctorSlides.map((slide, idx) => ({
      id: 13 + idx,
      label: `${14 + idx}. Dokter: ${slide.title}`
    })),
    { id: totalSlides - 1, label: `${totalSlides}. Connect: Media Sosial RSU Siloam Ambon` }
  ];

  // Helper to render the active slide component matching index
  const renderSlideContent = () => {
    const idx = currentSlideIndex;

    if (idx === 0) return <SlideCover data={dbState.cover} />;
    if (idx === 1) return <SlideExcelence data={dbState.excellence} />;
    if (idx === 2) return <SlideStats stats={dbState.stats} />;
    
    // Facilities (pages 1 to 5) indices 3 to 7
    if (idx >= 3 && idx <= 7) {
      const pageIndex = (idx - 2) as 1 | 2 | 3 | 4 | 5;
      return <SlideFacilities page={pageIndex} facilities={dbState.facilities} />;
    }
    
    if (idx === 8) return <SlideClinic data={dbState.clinic} />;

    // Machinery/Equipment indices 9 to 11
    if (idx >= 9 && idx <= 11) {
      const equipPage = (idx - 8) as 1 | 2 | 3;
      return <SlideEquipments page={equipPage} data={dbState.equipments} />;
    }

    if (idx === 12) return <SlidePlan data={dbState.plan} />;

    // Dynamic Doctor Specialties slides mapping internally 13 to 13+N
    if (idx >= 13 && idx < 13 + dynamicDoctorSlides.length) {
      const docSlide = dynamicDoctorSlides[idx - 13];
      return (
        <SlideDoctors 
          title={docSlide.title} 
          doctors={docSlide.doctors} 
          pageNumber={idx + 1}
          totalPages={totalSlides}
        />
      );
    }

    if (idx === totalSlides - 1) return <SlideSocialMedia data={dbState.socials} />;

    return <SlideCover data={dbState.cover} />;
  };

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

        </div>
      </header>

      {/* Main Slide Deck Canvas - Styled as dynamic PowerPoint widescreen screen */}
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
                  target.closest("a") ||
                  target.closest("[data-elfsight-app-lazy]") ||
                  target.closest(".elfsight-app-3c8fe8ac-3573-41c7-8021-843c986bcdcc") ||
                  target.closest(".elfsight-app-059beb55-6694-4f74-8a8d-57514994e975")
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

            {/* Elegant slider screen with transition */}
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

      {/* Slider deck controls footer navigation bar */}
      <footer className="w-full bg-slate-900/60 backdrop-blur-md border-t border-slate-800/50 px-6 py-4 shrink-0 flex flex-col md:flex-row justify-between items-center z-30 space-y-3 md:space-y-0 text-xs">
        
        {/* Custom Slide Catalog picker menu list */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-widest font-mono">Slide:</span>
          <select
            value={currentSlideIndex}
            onChange={(e) => {
              setCurrentSlideIndex(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-200 outline-none w-full md:w-64"
          >
            {slideCatalog.map(slide => (
              <option key={slide.id} value={slide.id}>
                {slide.label}
              </option>
            ))}
          </select>
        </div>

        {/* Presenter controls panel */}
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

        {/* Dynamic slides paging statistics */}
        <div className="text-slate-500 font-mono font-bold text-[10px] tracking-wider">
          SLIDES DECK PAGING: <span className="text-slate-300">{currentSlideIndex + 1}</span> / {totalSlides}
        </div>

      </footer>

      {/* Floating Database Search Roster Overlay */}
      {showRoster && (
        <RosterView
          doctors={dbState.doctors}
          onClose={() => setShowRoster(false)}
        />
      )}

    </div>
  );
}
