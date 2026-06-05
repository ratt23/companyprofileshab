import React from "react";
import { motion } from "motion/react";
import { CoverSlide } from "../types";

export function SlideCover({ data, pageNumber, totalPages }: { data?: CoverSlide; pageNumber?: number; totalPages?: number }) {
  // Use fallback if data is somehow missing
  const safeData = data || {
    title: "RSU Siloam Ambon",
    tagline: "Siloam Hospitals Ambon CORPORATE PRESENTATION",
    description: "Center of Excellence & Facility Presentation",
    image: ""
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden text-[#002f87]">
      {/* Background Image from CMS if available */}
      {safeData.image && (
        <div 
          className="absolute inset-0 opacity-10 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${safeData.image})` }}
        />
      )}

      {/* Main branded presentation entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center z-10 px-8"
      >
        {/* Centered logo */}
        <img 
          src="/logo.png" 
          alt="Siloam Hospitals Logo" 
          className="h-28 md:h-32 w-auto object-contain mb-6" 
          onError={(e) => {
            console.error("Failed to load cover logo.png");
          }}
        />

        {/* Small subtitle below the logo */}
        <p className="text-lg md:text-xl font-medium tracking-widest text-[#003399]/90 uppercase">
          Company Profile RSU Siloam Ambon
        </p>
      </motion.div>

      <div className="absolute bottom-8 left-12 text-slate-400 text-xs font-sans z-10">
        #BersamaSiloam
      </div>
      <div className="absolute bottom-8 right-12 text-slate-400 text-xs font-mono z-10">
        Page {pageNumber || 1} / {totalPages || 45}
      </div>
    </div>
  );
}
