import React from "react";
import { motion } from "motion/react";
import { Doctor } from "../types";
import { Stethoscope } from "lucide-react";

interface DoctorPortraitProps {
  doc: Doctor;
  getInitials: (name: string) => string;
}

function DoctorPortrait({ doc, getInitials }: DoctorPortraitProps) {
  const [hasError, setHasError] = React.useState(false);
  const imageUrl = doc.image_url || doc.avatarUrl;

  return (
    <div className="w-full aspect-[3/4] relative mb-4">
      {imageUrl && !hasError ? (
        <>
          <img 
            src={imageUrl} 
            alt={doc.name}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain object-center absolute inset-0 z-10"
          />
          {/* Bottom-anchored gradient white shadow to blend the cutoff of doctor photo into the background */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/50 to-transparent z-20 pointer-events-none" />
        </>
      ) : null}
      
      {(!imageUrl || hasError) && (
        <div className="absolute inset-0 flex flex-col justify-center items-center fallback-content bg-slate-50 rounded-2xl border border-slate-100 z-0">
          <span className="text-4xl font-black font-mono tracking-tight text-slate-300">
            {getInitials(doc.name)}
          </span>
          <Stethoscope className="w-12 h-12 text-slate-200 absolute" />
        </div>
      )}
    </div>
  );
}

interface SlideDoctorsProps {
  title: string;
  doctors: Doctor[];
  pageNumber: number;
  totalPages: number;
}

export function SlideDoctors({ title, doctors, pageNumber, totalPages }: SlideDoctorsProps) {
  // Helper to extract clean doctor initials for professional placeholder avatar
  const getInitials = (name: string) => {
    let clean = name.replace(/^(Dr\.|dr\.|drg\.)\s*/i, "").trim();
    clean = clean.split(",")[0].trim(); // Remove suffixes like Sp.THT
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "DR";
  };

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">


      {/* Slide Header */}
      <div className="flex justify-between items-center z-10 w-full mb-2">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            Siloam Hospitals Ambon
          </span>
        </div>
      </div>

      {/* Slide Body Layout */}
      <div className="flex-grow grid grid-cols-12 gap-8 z-10 items-center">
        
        {/* Left Column: Big Banner with Specialty title */}
        <div className="col-span-5 flex flex-col justify-center h-full pr-8">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[6rem] md:text-[7rem] font-black text-[#001f5c] leading-[0.85] tracking-tighter mb-6"
          >
            Our<br />Doctor
          </motion.h1>
          
          <motion.h2
            key={title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl font-medium text-[#001f5c]/90 uppercase tracking-wide leading-snug"
          >
            {title}
          </motion.h2>
        </div>

        {/* Right Column: Floating Doctor Portraits */}
        <div className={`col-span-7 h-full flex items-center gap-4 ${doctors.length === 1 ? 'justify-center' : 'justify-start'}`}>
            
          {doctors.map((doc, idx) => {
            return (
                <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center flex-1 max-w-[340px]"
              >
                <DoctorPortrait doc={doc} getInitials={getInitials} />

                {/* Name */}
                <h3 className="text-base md:text-xl font-extrabold text-[#001f5c] text-center leading-tight mt-2">
                  {doc.name}
                </h3>
              </motion.div>
            );
          })}

          {doctors.length === 0 && (
            <div className="w-full py-12 text-center text-slate-400">
              Belum ada dokter di spesialisasi ini.
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-[#001f5c] text-xs font-bold z-10">
        <span>#BersamaSiloam</span>
      </div>
    </div>
  );
}
