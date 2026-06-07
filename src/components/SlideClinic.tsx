import React from "react";
import { ClinicSlide } from "../types";
import { getProxiedImageUrl } from "../utils/imageUtils";

export function SlideClinic({ data, pageNumber, totalPages }: { data?: ClinicSlide; pageNumber?: number; totalPages?: number }) {
  const safeData = data || {
    title: "Executive Clinic",
    description: "Premium integrated clinic designed exclusively for executive comfort with luxury waiting rooms and one stop service.",
    schedule: "Senin - Sabtu, 08:00 - 20:00",
    amenities: ["One Stop Specialist Services", "Executive Lounge", "Personal Assistant"],
    image1: "/clinic_bg.png",
    image2: "/clinic_inset1.png",
    image3: "/clinic_inset2.png"
  };

  // Format the title to Title Case and split into two lines like the screenshot
  const titleText = safeData.title || "Executive Clinic";
  const words = titleText.split(" ");
  const line1 = words[0] ? (words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()) : "Executive";
  const line2 = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") || "Clinic";

  const defaultBg = "/clinic_bg.png";
  const defaultInset1 = "/clinic_inset1.png";
  const defaultInset2 = "/clinic_inset2.png";

  return (
    <div className="relative w-full h-full bg-slate-950 text-white overflow-hidden font-sans select-none">
      {/* Background Image (Image 1) */}
      <img
        src={getProxiedImageUrl(safeData.image1 || defaultBg)}
        alt="Executive Clinic Lobby"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Soft dark overlay on the left to guarantee readability of the white text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

      {/* Top Left: Logo */}
      <div className="absolute top-8 left-12 z-10">
        <img src="/logo.png" alt="RSU Siloam" className="h-8 w-auto object-contain" />
      </div>

      {/* Left-Middle: Massive Title */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-xl z-10 flex flex-col justify-center">
        <h1 className="text-6xl md:text-[5rem] font-black text-white leading-[0.9] tracking-tight uppercase">
          {line1}<br />
          <span className="text-white">{line2}</span>
        </h1>
      </div>

      {/* Right Side: Stacked Inset Images (Image 2 and 3) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[35%] flex flex-col gap-6 z-10">
        <div className="border-[6px] border-white rounded-[24px] shadow-2xl overflow-hidden aspect-[1.5] bg-slate-800 transition-transform hover:scale-[1.02] duration-300">
          <img
            src={getProxiedImageUrl(safeData.image2 || defaultInset1)}
            alt="Executive Clinic Lounge Seating"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="border-[6px] border-white rounded-[24px] shadow-2xl overflow-hidden aspect-[1.5] bg-slate-800 transition-transform hover:scale-[1.02] duration-300">
          <img
            src={getProxiedImageUrl(safeData.image3 || defaultInset2)}
            alt="Executive Clinic Waiting Hallway"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Left: Hashtag */}
      <div className="absolute bottom-8 left-12 z-10">
        <span className="text-sm font-bold text-[#003399] tracking-wide">#BersamaSiloam</span>
      </div>

      {/* Bottom Right: Page Numbering */}
      {pageNumber !== undefined && totalPages !== undefined && (
        <div className="absolute bottom-8 right-12 z-10">
          <span className="font-mono text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
            Page {pageNumber} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
