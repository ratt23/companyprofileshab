import React from "react";
import { motion } from "motion/react";
import { Star, ChevronRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { ClinicSlide } from "../types";

export function SlideClinic({ data, pageNumber, totalPages }: { data?: ClinicSlide; pageNumber?: number; totalPages?: number }) {
  const safeData = data || {
    title: "EXECUTIVE CLINIC",
    description: "Premium integrated clinic designed exclusively for executive comfort with luxury waiting rooms and one stop service.",
    schedule: "Senin - Sabtu, 08:00 - 20:00",
    amenities: ["One Stop Specialist Services", "Executive Lounge", "Personal Assistant"]
  };

  const highlights = [
    "No Queues (Bebas Antrean Umum)",
    "Pribadi & Confidential",
    "Pilihan Dokter Terbaik",
    "Kecepatan Pelayanan 2x Lipat",
    "Alur Satu Atap Terintegrasi"
  ];

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">
      
      {/* Slide Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            Siloam Hospitals Ambon
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>Executive Services Portal</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-left mt-4 z-10">
        <h2 className="text-5xl font-black text-[#003399] tracking-tight leading-none uppercase">
          {safeData.title}
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-widest font-mono">
          Siloam Hospitals Ambon Luxury Healing Spaces
        </p>
      </div>

      {/* Interactive Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto z-10 items-center py-4">
        
        {/* Left Side: Mockups with elegant styling and tab selection */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="relative rounded-2xl bg-white border border-slate-100 p-4 shadow-2xl shadow-slate-200/50 overflow-hidden group">
            
            {/* Ambient Wood-themed simulated image panel since we don't have static images */}
            <div className="h-[200px] rounded-xl relative overflow-hidden flex flex-col justify-between p-5 transition-all duration-500 bg-gradient-to-tr from-[#0d4ea5] via-[#02316e] to-[#1e293b] text-sky-50">
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  PORTFOLIO SHOWCASE
                </span>
                <span className="text-xs font-mono flex items-center bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {safeData.schedule}
                </span>
              </div>

              {/* Decorative timber lining vector simulation */}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-800/20 backdrop-blur-xs flex justify-around pointer-events-none">
                <div className="w-1 h-full bg-amber-700/40" />
                <div className="w-1 h-full bg-amber-750/40" />
                <div className="w-1 h-full bg-amber-700/40" />
                <div className="w-1 h-full bg-amber-750/40" />
                <div className="w-1 h-full bg-amber-700/40" />
              </div>

              <div className="z-10 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                <h4 className="text-lg font-black">{safeData.title}</h4>
                <p className="text-[11px] opacity-90 mt-1 leading-snug">{safeData.description}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Feature bullet points */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 shadow-sm">
            <h4 className="flex items-center text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> LUXURY HOSPITALITY FEATURES
            </h4>
            
            <ul className="space-y-3">
              {(safeData.amenities || []).map((feature, i) => (
                <li key={i} className="flex items-start text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#003399] mb-2 font-mono">
              KEUNGGULAN UTAMA CLINIC
            </h4>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold bg-white border border-slate-100 shadow-sm text-[#002f8a] px-3 py-1.5 rounded-xl flex items-center"
                >
                  <ChevronRight className="w-3 h-3 text-amber-500 mr-1" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || 9} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
