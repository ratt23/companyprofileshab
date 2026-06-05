import React from "react";
import { motion } from "motion/react";
import { Baby, Activity, ShieldAlert, ChevronRight, Star } from "lucide-react";
import { ExcellenceItem } from "../types";

export function SlideExcelence({ data, pageNumber, totalPages }: { data?: ExcellenceItem[]; pageNumber?: number; totalPages?: number }) {
  const safeData = data || [];
  
  // Fallback to hardcoded if no dynamic data available yet
  const cards = safeData.length > 0 ? safeData : [
    {
      title: "OBSGYN",
      description: "Prosedur melahirkan dengan ERACS\nILA (Intrathecal Labor Analgesia)\nWELA (Water Birth / Alternative births)",
      image: ""
    }
  ];

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">
      {/* Brand logo header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            Siloam Hospitals Ambon
          </span>
        </div>
        <span className="text-sm font-semibold tracking-wider text-[#b0841a] bg-amber-50 px-3 py-1 rounded-full">
          INDONESIA'S LEADING HOSPITALS
        </span>
      </div>

      {/* Main content grid */}
      <div className="my-auto">
        <div className="mb-6">
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase font-bold tracking-widest text-[#b0841a]"
          >
            Siloam Hospitals Ambon
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#003399] leading-none"
          >
            CENTER OF <br className="hidden md:inline" />EXCELLENCE
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            // Use split by newline for points
            const points = card.description ? card.description.split('\n').filter(p => p.trim() !== '') : [];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-100 flex flex-col justify-between border border-blue-50/50 relative overflow-hidden group hover:border-blue-100 transition-all"
              >
                {/* Colored top-accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  index % 3 === 0 ? 'bg-[#003399]' : index % 3 === 1 ? 'bg-[#b0841a]' : 'bg-[#0a66c2]'
                }`} />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    {card.image ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow">
                         <img src={card.image} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                        <Star className="w-8 h-8 text-[#003399]" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#002f87] mb-4">
                    {card.title}
                  </h3>

                  <ul className="space-y-2">
                    {points.map((point, i) => (
                      <li key={i} className="flex items-start text-xs text-slate-700">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0 mr-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-[#003399] flex items-center justify-between pointer-events-none group-hover:text-amber-600 transition-colors">
                  <span>Pelajari Detail Unggulan</span>
                  <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center text-slate-400 text-xs">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || 2} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
