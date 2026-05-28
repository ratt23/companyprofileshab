import React from "react";
import { motion } from "motion/react";
import { Zap, Cpu, Settings } from "lucide-react";
import { EquipmentItem } from "../types";

interface SlideEquipmentsProps {
  page: 1 | 2 | 3; // pagination
  data?: EquipmentItem[];
}

export function SlideEquipments({ page, data }: SlideEquipmentsProps) {
  const safeData = data || [];
  
  // Calculate items for current page (2 per page)
  const startIndex = (page - 1) * 2;
  const items = safeData.slice(startIndex, startIndex + 2);

  // Fallback to empty states if no items configured
  while (items.length < 2 && items.length > 0) {
    items.push({ name: "", description: "", image: "" }); // Fill empty slots
  }

  const getAccentGradient = (index: number) => {
    switch (index % 4) {
      case 0: return "from-amber-500/10 to-transparent border-amber-500/20";
      case 1: return "from-sky-500/10 to-transparent border-sky-500/20";
      case 2: return "from-emerald-500/10 to-transparent border-emerald-500/20";
      default: return "from-indigo-500/10 to-transparent border-indigo-500/20";
    }
  };

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
        <div className="text-right">
          <span className="text-xs font-bold text-[#b0841a] tracking-widest uppercase">
            MEDICAL EQUIPMENTS
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 mb-4 z-10">
        <h2 className="text-4xl font-extrabold text-[#003399] tracking-tight">
          Our Facilities
        </h2>
        <p className="text-xs text-slate-400 font-mono uppercase mt-1">
          PERALATAN MEDIS CANGGIH & REVOLUSIONER
        </p>
      </div>

      {/* Main Grid: Shows 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto z-10 items-stretch py-4">
        {items.filter(m => m.name).map((machine, index) => {
          const actualIndex = startIndex + index;
          return (
            <motion.div
              key={actualIndex}
              initial={{ opacity: 0, scale: 0.98, x: index === 0 ? -15 : 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className={`bg-white border select-none rounded-2xl p-6 shadow-xl shadow-slate-100/50 flex flex-col justify-between transition-all relative overflow-hidden group border-slate-150`}
            >
              {/* Ambient accent background corners */}
              <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full pointer-events-none filter blur-2xl opacity-40 bg-gradient-to-br ${getAccentGradient(actualIndex)}`} />

              <div>
                <div className="flex justify-between items-center mb-4">
                  {machine.image ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow">
                        <img src={machine.image} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:scale-105 transition-transform">
                      <Cpu className="w-6 h-6 text-[#003399]" />
                    </div>
                  )}
                  <div className="text-[9px] font-bold text-[#b0841a] uppercase bg-amber-50 rounded-full px-2.5 py-1 tracking-wider border border-amber-100/20">
                    HIGH-TECH EQUIP
                  </div>
                </div>

                <h3 className="text-2xl font-black text-[#002f8a] tracking-tight mb-3">
                  {machine.name}
                </h3>
                
                {/* Splitting description into a main paragraph and bullet points if newlines exist */}
                {machine.description && (
                  <div className="text-xs text-slate-500 leading-relaxed mb-6">
                    {machine.description.split('\n').map((line, i) => (
                       <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {9 + page} / 45</span>
      </div>
    </div>
  );
}
