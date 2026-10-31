import React, { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Doctor, YearStats, HospitalFacility, DatabaseState, SlideConfigItem, PartnerSlide } from "./types";
import { SlideCover } from "./components/SlideCover";
import { SlideExcelence } from "./components/SlideExcelence";
import { SlideStats } from "./components/SlideStats";
import { SlideFacilities } from "./components/SlideFacilities";
import { SlideClinic } from "./components/SlideClinic";
import { SlidePartner } from "./components/SlidePartner";
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
  RefreshCw,
  Clock,
  X,
  LayoutList
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
const buildDefaultSlideConfig = (dynamicDoctorSlides: DynamicSlide[], partners: PartnerSlide[] = []): SlideConfigItem[] => {
  const config: SlideConfigItem[] = [
    { id: "cover", label: "Cover Slide – Sambutan RSU Siloam", enabled: true },
    { id: "excellence", label: "Center of Excellence (Layanan Unggulan)", enabled: true },
    { id: "stats", label: "Tren Statistik Kunjungan Pasien", enabled: true },
    { id: "facilities-1", label: "Layanan: IGD 24 Jam & Siloam at Home", enabled: true },
    { id: "facilities-2", label: "Layanan: Radiologi & Rawat Jalan", enabled: true },
    { id: "facilities-3", label: "Layanan: Rawat Inap & Ambulans Rescue", enabled: true },
    { id: "facilities-4", label: "Bangsal Terintegrasi: Kamar VVIP, VIP, Kelas I", enabled: true },
    { id: "facilities-5", label: "Bangsal Terintegrasi: Kamar Kelas II & III", enabled: true },
    { id: "clinic", label: "Executive Clinic: Lobby Premium & Lounge", enabled: true },
  ];

  if (partners && partners.length > 0) {
    partners.forEach(partner => {
      config.push({
        id: `partner-${partner.id}`,
        label: `Our Partner: ${partner.title || 'Mitra & Kerjasama'}`,
        enabled: true
      });
    });
  } else {
    config.push({
      id: "partner-default",
      label: "Our Partner: Mitra & Kerjasama",
      enabled: true
    });
  }

  config.push(
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
    { id: "socials", label: "Connect: Media Sosial RSU Siloam Ambon", enabled: true }
  );

  return config;
};

function mergeSlideConfigWithPartners(
  storedConfig: SlideConfigItem[],
  partners: PartnerSlide[]
): SlideConfigItem[] {
  if (!partners || partners.length === 0) {
    const hasDefault = storedConfig.some(s => s.id === "partner-default");
    if (hasDefault) return storedConfig;
    const result: SlideConfigItem[] = [];
    let inserted = false;
    for (const item of storedConfig) {
      result.push(item);
      if (item.id === "clinic") {
        result.push({ id: "partner-default", label: "Our Partner: Mitra & Kerjasama", enabled: true });
        inserted = true;
      }
    }
    if (!inserted) {
      result.push({ id: "partner-default", label: "Our Partner: Mitra & Kerjasama", enabled: true });
    }
    return result;
  }

  const partnerIds = new Set(partners.map(p => `partner-${p.id}`));
  let filtered = storedConfig.filter(item => {
    if (item.id === "partner-default") return false;
    if (item.id.startsWith("partner-") && !partnerIds.has(item.id)) return false;
    return true;
  });

  const existingPartnerIds = new Set(filtered.map(s => s.id));
  const newPartnerItems: SlideConfigItem[] = [];
  partners.forEach(partner => {
    const id = `partner-${partner.id}`;
    if (!existingPartnerIds.has(id)) {
      newPartnerItems.push({
        id,
        label: `Our Partner: ${partner.title || 'Mitra & Kerjasama'}`,
        enabled: true
      });
    }
  });

  if (newPartnerItems.length > 0) {
    const result: SlideConfigItem[] = [];
    let inserted = false;
    for (const item of filtered) {
      result.push(item);
      if (item.id === "clinic") {
        result.push(...newPartnerItems);
        inserted = true;
      }
    }
    if (!inserted) {
      result.push(...newPartnerItems);
    }
    return result;
  }

  return filtered;
}

// Map a slide config ID to the actual JSX component
type RenderArgs = {
  dynamicDoctorSlides: DynamicSlide[];
  dbState: DatabaseState;
  totalPages: number;
  pageNumber: number;
};

const renderSlideById = (
  id: string,
  args: RenderArgs
): React.ReactNode | null => {
  const { dynamicDoctorSlides, dbState, totalPages, pageNumber } = args;

  if (id === "cover") return <SlideCover data={dbState.cover} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "excellence") return <SlideExcelence data={dbState.excellence} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "stats") return <SlideStats stats={dbState.stats} statsMeta={dbState.statsMeta} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "facilities-1") return <SlideFacilities page={1} facilities={dbState.facilities} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "facilities-2") return <SlideFacilities page={2} facilities={dbState.facilities} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "facilities-3") return <SlideFacilities page={3} facilities={dbState.facilities} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "facilities-4") return <SlideFacilities page={4} facilities={dbState.facilities} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "facilities-5") return <SlideFacilities page={5} facilities={dbState.facilities} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "clinic") return <SlideClinic data={dbState.clinic} pageNumber={pageNumber} totalPages={totalPages} />;
  
  if (id === "partner-default") {
    return <SlidePartner data={undefined} pageNumber={pageNumber} totalPages={totalPages} />;
  }
  if (id.startsWith("partner-")) {
    const partnerId = id.replace("partner-", "");
    const partnerData = (dbState.partners || []).find(p => p.id === partnerId);
    return <SlidePartner data={partnerData} pageNumber={pageNumber} totalPages={totalPages} />;
  }

  if (id === "equipments-1") return <SlideEquipments page={1} data={dbState.equipments} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "equipments-2") return <SlideEquipments page={2} data={dbState.equipments} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "equipments-3") return <SlideEquipments page={3} data={dbState.equipments} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "plan") return <SlidePlan data={dbState.plan} pageNumber={pageNumber} totalPages={totalPages} />;
  if (id === "socials") return <SlideSocialMedia data={dbState.socials} pageNumber={pageNumber} totalPages={totalPages} />;

  // Dynamic doctor slide IDs: "doctors-0", "doctors-1", etc.
  if (id.startsWith("doctors-")) {
    const pageIdx = parseInt(id.split("-")[1]);
    const docSlide = dynamicDoctorSlides[pageIdx];
    if (docSlide) {
      return (
        <SlideDoctors
          title={docSlide.title}
          doctors={docSlide.doctors}
          pageNumber={pageNumber}
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
    updateClinic,
    nextSlide,
    prevSlide
  } = useSlideStore();

  const [showAdmin, setShowAdmin] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isPresentation = useMemo(() => window.location.search.includes("view=fullscreen"), []);

  // Viewport and mobile layout states
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [mobileForceFullscreen, setMobileForceFullscreen] = useState(true);
  const [mobileShowToC, setMobileShowToC] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // ResizeObserver for current and next slide previews
  const [previewSize, setPreviewSize] = useState({ width: 640, height: 360, scale: 0.5 });
  const [nextPreviewSize, setNextPreviewSize] = useState({ width: 320, height: 180, scale: 0.25 });
  const previewRef = useRef<HTMLDivElement>(null);
  const nextPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      // 1. Calculate size for primary current slide preview
      if (previewRef.current) {
        const parentWidth = previewRef.current.clientWidth;
        const parentHeight = previewRef.current.clientHeight;
        if (parentWidth > 0 && parentHeight > 0) {
          let width = parentWidth;
          let height = parentWidth * (720 / 1280);
          if (height > parentHeight) {
            height = parentHeight;
            width = parentHeight * (1280 / 720);
          }
          const scale = width / 1280;
          setPreviewSize({ width, height, scale });
        }
      }

      // 2. Calculate size for next slide preview
      if (nextPreviewRef.current) {
        const parentWidth = nextPreviewRef.current.clientWidth;
        const parentHeight = nextPreviewRef.current.clientHeight;
        if (parentWidth > 0 && parentHeight > 0) {
          let width = parentWidth;
          let height = parentWidth * (720 / 1280);
          if (height > parentHeight) {
            height = parentHeight;
            width = parentHeight * (1280 / 720);
          }
          const scale = width / 1280;
          setNextPreviewSize({ width, height, scale });
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (previewRef.current) resizeObserver.observe(previewRef.current);
    if (nextPreviewRef.current) resizeObserver.observe(nextPreviewRef.current);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Stopwatch duration timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getSpeakerNotesForSlide = (id: string, activeIdx: number): string => {
    if (id === "cover") {
      return "Selamat datang! Sambut hadirin & pimpinan RSU Siloam Ambon. Berikan pengantar singkat mengenai presentasi profil rumah sakit.";
    }
    if (id === "excellence") {
      return "Center of Excellence: Jelaskan spesialisasi & fasilitas unggulan yang menjadi fokus utama pelayanan RSU Siloam.";
    }
    if (id === "stats") {
      return "Statistik Kunjungan: Tunjukkan tren data rawat jalan (outpatient), rawat inap (inpatient), bedah, emergency, dan MCU.";
    }
    if (id.startsWith("facilities-")) {
      return "Layanan & Fasilitas Penunjang Medis: Jelaskan ketersediaan IGD 24 Jam, Siloam at Home, Radiologi, Bangsal Kamar VVIP/VIP/Kelas I/II/III, Ambulans Rescue.";
    }
    if (id === "clinic") {
      return "Executive Clinic: Paparkan kelebihan area pelayanan eksklusif lobby premium, lounge, kenyamanan pasien, dan jadwal operasional.";
    }
    if (id.startsWith("partner-")) {
      return "Mitra & Kerjasama: Sebutkan mitra strategis, asuransi, dan corporate partners RSU Siloam yang mendukung pembiayaan pasien.";
    }
    if (id.startsWith("equipments-")) {
      return "Peralatan Medis Canggih: Terangkan alat berteknologi tinggi seperti ESWL (pemecah batu ginjal), C-Arm, CT-Scan Diagnostik, Bedah Phaco, & Mikroskop Bedah.";
    }
    if (id === "plan") {
      return "Rencana Jangka Panjang: Rencana penambahan layanan baru, ekspansi sarana prasarana, peningkatan SDM dokter & perawat.";
    }
    if (id.startsWith("doctors")) {
      return "Dokter Spesialis: Informasikan daftar dokter spesialis handal beserta jadwal praktek mereka yang sedang aktif.";
    }
    if (id === "socials") {
      return "Media Sosial: Ajak audiens untuk mem-follow Instagram, Facebook, TikTok, dan meninggalkan ulasan bintang 5 di Google Maps.";
    }
    return "Review slide data saat presentasi.";
  };

  // Sync state via BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel("slide_sync");
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SYNC_INDEX") {
        if (currentSlideIndex !== event.data.index) {
          setCurrentSlideIndex(event.data.index);
        }
      } else if (event.data.type === "SYNC_PLAY") {
        if (isPlaying !== event.data.isPlaying) {
          setIsPlaying(event.data.isPlaying);
        }
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [currentSlideIndex, isPlaying, setCurrentSlideIndex, setIsPlaying]);

  // Broadcast currentSlideIndex changes
  useEffect(() => {
    const channel = new BroadcastChannel("slide_sync");
    channel.postMessage({ type: "SYNC_INDEX", index: currentSlideIndex });
    channel.close();
  }, [currentSlideIndex]);

  // Broadcast isPlaying changes
  useEffect(() => {
    const channel = new BroadcastChannel("slide_sync");
    channel.postMessage({ type: "SYNC_PLAY", isPlaying });
    channel.close();
  }, [isPlaying]);

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
    const defaultConfig = buildDefaultSlideConfig(dynamicDoctorSlides, dbState.partners);

    // Use stored config if available; else use default
    const storedConfig = slideConfig.length > 0 ? slideConfig : (dbState.slideConfig && dbState.slideConfig.length > 0 ? dbState.slideConfig : []);

    // If no stored config, generate default and save to store
    if (storedConfig.length === 0) {
      setSlideConfig(defaultConfig);
      // Expand doctors group into individual slides
      return expandDoctorsGroup(defaultConfig, dynamicDoctorSlides);
    }

    const mergedConfig = mergeSlideConfigWithPartners(storedConfig, dbState.partners || []);
    return expandDoctorsGroup(mergedConfig, dynamicDoctorSlides);
  }, [slideConfig, dbState.slideConfig, dynamicDoctorSlides, dbState.partners]);



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

  // Autoplay (Only active on control tab, not on presentation tab to avoid duplicate increments)
  useEffect(() => {
    if (isPlaying && !isPresentation) {
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
  }, [isPlaying, currentSlideIndex, totalSlides, nextSlide, isPresentation]);

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

  const openPresentationTab = () => {
    window.open(window.location.origin + window.location.pathname + "?view=fullscreen", "_blank");
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
    if (!currentSlide) return <SlideCover data={dbState.cover} pageNumber={1} totalPages={totalSlides} />;

    const content = renderSlideById(currentSlide.id, {
      dynamicDoctorSlides,
      dbState,
      totalPages: totalSlides,
      pageNumber: currentSlideIndex + 1,
    });

    return content || <SlideCover data={dbState.cover} />;
  };

  // Build the dropdown catalog from active slides
  const slideCatalog = activeSlides.map((slide, idx) => ({
    id: idx,
    label: `${idx + 1}. ${slide.label}`
  }));

  // Early exit: Case A - Presentation View Tab (view=fullscreen)
  if (isPresentation) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden select-none text-white">
        <main className="w-screen h-screen p-0 m-0 relative">
          {loading ? (
            <div className="text-center absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-950">
              <RefreshCw className="w-10 h-10 animate-spin text-amber-500" />
              <p className="text-slate-400 text-xs font-mono">Menyiapkan Database Slide RSU Siloam...</p>
            </div>
          ) : (
            <div
              className="w-full h-full bg-white overflow-hidden relative flex flex-col justify-between"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "BUTTON" || target.closest("button") || target.closest("a")) return;
                nextSlide(totalSlides);
                setIsPlaying(false);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                prevSlide(totalSlides);
                setIsPlaying(false);
              }}
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
      </div>
    );
  }

  // Early exit: Case B - Mobile / Tablet Optimized Fullscreen Layout
  if (isMobileOrTablet && mobileForceFullscreen) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden select-none text-white">
        <main className="w-screen h-screen p-0 m-0 relative">
          {loading ? (
            <div className="text-center absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-950">
              <RefreshCw className="w-10 h-10 animate-spin text-amber-500" />
              <p className="text-slate-400 text-xs font-mono">Menyiapkan Database Slide RSU Siloam...</p>
            </div>
          ) : (
            <div
              className="w-full h-full bg-white overflow-hidden relative flex flex-col justify-between"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "BUTTON" || target.closest("button") || target.closest("a")) return;
                nextSlide(totalSlides);
                setIsPlaying(false);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                prevSlide(totalSlides);
                setIsPlaying(false);
              }}
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

              {/* Floating Mobile Controls Overlay */}
              <div className="fixed bottom-4 right-4 z-40 flex items-center space-x-2 bg-slate-900/90 backdrop-blur border border-slate-800 p-2 rounded-2xl shadow-xl">
                <button
                  onClick={() => setMobileShowToC(!mobileShowToC)}
                  className={`p-2 rounded-xl border transition-colors ${
                    mobileShowToC 
                      ? "bg-amber-600 border-amber-500/30 text-white" 
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                  title="Daftar Isi"
                >
                  <LayoutList className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isPlaying 
                      ? "bg-amber-600 border-amber-500/30 text-white" 
                      : "bg-slate-800 border-slate-700 text-slate-350"
                  }`}
                  title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                </button>

                <button
                  onClick={() => {
                    setMobileForceFullscreen(false);
                    setMobileShowToC(false);
                  }}
                  className="p-2 bg-red-650 hover:bg-red-700 border border-red-500/30 rounded-xl text-white transition-colors"
                  title="Keluar Layar Penuh"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Floating Slide list sheet */}
              {mobileShowToC && (
                <div className="fixed bottom-16 right-4 w-72 max-h-[60vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-850 rounded-2xl shadow-2xl z-50 p-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">DAFTAR ISI SLIDE</span>
                    <span className="text-[9px] font-mono text-slate-500">{currentSlideIndex + 1} / {totalSlides}</span>
                  </div>
                  <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-1">
                    {activeSlides.map((slide, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlideIndex(idx);
                          setIsPlaying(false);
                          setMobileShowToC(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${
                          currentSlideIndex === idx
                            ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                            : "text-slate-450 hover:text-slate-200 hover:bg-slate-800 border border-transparent"
                        }`}
                      >
                        <span className="truncate">{idx + 1}. {slide.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Render Presenter View content for desktop
  const renderDesktopPresenter = () => {
    const nextSlideIndex = currentSlideIndex < totalSlides - 1 ? currentSlideIndex + 1 : 0;
    const currentSlideItem = activeSlides[currentSlideIndex];
    const nextSlideItem = activeSlides[nextSlideIndex];

    const currentNotes = currentSlideItem 
      ? getSpeakerNotesForSlide(currentSlideItem.id, currentSlideIndex) 
      : "No notes for this slide.";

    const currentSlideClass = isFullscreen
      ? "w-full h-full bg-white relative flex flex-col justify-between"
      : "relative bg-white shadow-2xl overflow-hidden select-none shrink-0";

    return (
      <div className="flex-grow w-full flex overflow-hidden p-6 gap-6 z-10">
        
        {/* Left Column: Current Slide & Timer Controls */}
        <div className="w-3/5 flex flex-col space-y-4 items-center justify-start overflow-hidden">
          
          {/* Section Label */}
          {!isFullscreen && (
            <div className="w-full flex justify-between items-center mb-1 shrink-0">
              <span className="text-xs font-black tracking-widest text-amber-500 uppercase">
                SEKARANG DI TAMPILAN PRESENTASI:
              </span>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-900/40">
                SLIDE {currentSlideIndex + 1} OF {totalSlides}
              </span>
            </div>
          )}

          {/* Current Slide Scale Wrapper (or Fullscreen element) */}
          <div 
            ref={previewRef}
            className="flex-grow w-full min-h-0 bg-slate-950/40 rounded-2xl border border-slate-800/80 shadow-inner flex items-center justify-center overflow-hidden relative"
          >
            <div 
              ref={containerRef}
              className={currentSlideClass}
              style={isFullscreen ? undefined : {
                width: `${previewSize.width}px`,
                height: `${previewSize.height}px`,
              }}
              onClick={isFullscreen ? (e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "BUTTON" || target.closest("button") || target.closest("a")) return;
                nextSlide(totalSlides);
                setIsPlaying(false);
              } : undefined}
              onContextMenu={isFullscreen ? (e) => {
                e.preventDefault();
                prevSlide(totalSlides);
                setIsPlaying(false);
              } : undefined}
            >
              {/* If fullscreen, render 1:1, else scale down dynamically */}
              <div 
                className={isFullscreen ? "w-full h-full relative" : "absolute top-0 left-0"}
                style={isFullscreen ? undefined : {
                  width: '1280px',
                  height: '720px',
                  transform: `scale(${previewSize.scale})`,
                  transformOrigin: 'top left',
                  pointerEvents: 'none'
                }}
              >
                {/* Global Animated Background waves (only when fullscreened locally) */}
                {isFullscreen && (
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
                )}

                {isFullscreen ? (
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
                ) : (
                  renderSlideContent()
                )}
              </div>
            </div>
          </div>

          {/* Presenter Timer Control Dashboard Card */}
          {!isFullscreen && (
            <div className="w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 block uppercase tracking-wider">Durasi Presentasi:</span>
                  <span className="font-mono text-2xl font-black text-slate-100">{formatTime(elapsedSeconds)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTimerIsRunning(!timerIsRunning)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold leading-none transition-colors border ${
                    timerIsRunning 
                      ? "bg-amber-600/10 border-amber-500/30 text-amber-400 hover:bg-amber-600/20" 
                      : "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20"
                  }`}
                >
                  {timerIsRunning ? "Pause Timer" : "Mulai Timer"}
                </button>
                <button
                  onClick={() => setElapsedSeconds(0)}
                  className="px-3 py-1.5 bg-slate-805 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold leading-none transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Next Slide & Quick Navigator */}
        {!isFullscreen && (
          <div className="w-2/5 flex flex-col space-y-4 overflow-hidden h-full">
            
            {/* Next Slide Preview */}
            <div className="flex flex-col space-y-1.5 h-[45%] min-h-[180px] shrink-0">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase font-sans">
                SLIDE BERIKUTNYA:
              </span>
              <div 
                ref={nextPreviewRef}
                className="flex-grow w-full min-h-0 bg-slate-950/40 rounded-xl border border-slate-800/80 overflow-hidden relative flex items-center justify-center select-none"
              >
                <div
                  className="relative bg-white shadow-lg overflow-hidden select-none shrink-0"
                  style={{
                    width: `${nextPreviewSize.width}px`,
                    height: `${nextPreviewSize.height}px`,
                  }}
                >
                  <div 
                    className="absolute top-0 left-0"
                    style={{
                      width: '1280px',
                      height: '720px',
                      transform: `scale(${nextPreviewSize.scale})`,
                      transformOrigin: 'top left',
                      pointerEvents: 'none'
                    }}
                  >
                    {nextSlideItem ? (
                      renderSlideById(nextSlideItem.id, {
                        dynamicDoctorSlides,
                        dbState,
                        totalPages: totalSlides,
                        pageNumber: nextSlideIndex + 1,
                      })
                    ) : (
                      <SlideCover data={dbState.cover} />
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-amber-500 font-bold block truncate w-full mt-0.5 font-mono">
                {nextSlideItem ? `${nextSlideIndex + 1}. ${nextSlideItem.label}` : "None"}
              </span>
            </div>

            {/* Slide list navigator sidebar */}
            <div className="flex flex-col space-y-1.5 flex-grow min-h-[180px] overflow-hidden">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase font-sans">
                NAVIGASI DAFTAR ISI SLIDE:
              </span>
              <div className="flex-1 overflow-y-auto bg-slate-900/50 border border-slate-800/80 rounded-2xl p-2 space-y-1">
                {activeSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex justify-between items-center ${
                      currentSlideIndex === idx
                        ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-transparent"
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {slide.label}</span>
                    {currentSlideIndex === idx && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1 rounded font-mono">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    );
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
          <button
            onClick={() => setShowAdmin(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-[#003399] rounded-xl text-xs font-bold leading-none flex items-center space-x-1.5 transition-all text-slate-200 border border-slate-700/50 shadow"
          >
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            <span>Admin Panel</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {isMobileOrTablet ? (
        /* Mobile Non-Fullscreen Mode: Centered canvas */
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
                const target = e.target as HTMLElement;
                if (target.tagName === "BUTTON" || target.closest("button") || target.closest("a")) return;
                nextSlide(totalSlides);
                setIsPlaying(false);
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
      ) : (
        /* Desktop Mode: Render PowerPoint Presenter View! */
        loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center space-y-3">
              <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mx-auto" />
              <p className="text-slate-400 text-xs font-mono">Menyiapkan Database Slide RSU Siloam...</p>
            </div>
          </div>
        ) : (
          renderDesktopPresenter()
        )
      )}

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

          <div className="flex items-center space-x-2">
            {/* If mobile/tablet and NOT forced fullscreen, show button to re-enter mobile fullscreen */}
            {isMobileOrTablet && !mobileForceFullscreen && (
              <button
                onClick={() => setMobileForceFullscreen(true)}
                title="Masuk Mode Layar Penuh Mobile"
                className="p-2 bg-amber-600 hover:bg-amber-700 border border-amber-500/30 rounded-xl text-white flex items-center space-x-1"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[10px] font-bold px-1">Layar Penuh Mobile</span>
              </button>
            )}

            {/* Open Presentation in New Tab */}
            <button
              onClick={openPresentationTab}
              title="Buka Tampilan Presentasi di Tab Baru (Untuk Proyektor)"
              className="p-2 bg-slate-805 hover:bg-slate-800 border border-slate-750 rounded-xl text-slate-300 hover:text-white flex items-center space-x-1"
            >
              <Tv className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-bold px-1 text-slate-300">Present</span>
            </button>

            {/* Local Fullscreen (like before) */}
            <button
              onClick={toggleFullscreen}
              title="Layar Penuh di Tab Ini (F)"
              className="p-2 bg-slate-805 hover:bg-slate-800 border border-slate-750 rounded-xl text-slate-300 hover:text-white flex items-center space-x-1"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-500" /> : <Maximize2 className="w-4 h-4 text-amber-500" />}
              <span className="text-[10px] font-bold px-1 text-slate-300">Layar Penuh</span>
            </button>
          </div>
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

      {/* Floating Admin Panel Overlay */}
      {showAdmin && (
        <AdminPanel
          doctors={dbState.doctors}
          stats={dbState.stats}
          clinic={dbState.clinic || { title: "EXECUTIVE CLINIC", description: "", schedule: "", amenities: [] }}
          onUpdateData={updateDatabase}
          onUpdateClinic={updateClinic}
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
