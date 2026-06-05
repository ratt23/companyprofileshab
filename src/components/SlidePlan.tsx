import React from "react";
import { motion } from "motion/react";
import { CalendarRange } from "lucide-react";
import { PlanSlide } from "../types";

const timelineData = [
  {
    year: "2025",
    title: "2025 at Siloam Ambon",
    points: ["Kamar Rawat Inap :\nmenjadi total 145 Bed", "Executive Clinic", "ICU + NICU"],
    position: "top",
  },
  {
    year: "2026",
    title: "2026 at Siloam Ambon",
    points: ["Penambahan IPD\nlt. 9 75 Bed", "Laparoscopy"],
    position: "bottom",
  },
  {
    year: "2027",
    title: "2027 at Siloam Ambon",
    points: ["Cath Lab", "Penambahan Bed IPD\nlt. 8 100 Bed", "Kemoterapi"],
    position: "top",
  },
  {
    year: "2028",
    title: "2028 at Siloam Ambon",
    points: ["MRI"],
    position: "bottom",
  },
];

export function SlidePlan({ data, pageNumber, totalPages }: { data?: PlanSlide; pageNumber?: number; totalPages?: number }) {
  const safeData = data || {
    title: "HOSPITAL MASTER PLAN",
    description: "Our vision for the future expansion of RSU Siloam Ambon.",
    image: ""
  };

  const rawTimeline = safeData.timeline && safeData.timeline.length > 0 ? safeData.timeline : timelineData;

  const resolvedTimeline = rawTimeline.map(node => {
    let pts: string[] = [];
    if (Array.isArray(node.points)) {
      pts = node.points;
    } else if (typeof node.points === 'string') {
      pts = node.points.split('\n').filter(p => p.trim() !== '');
    }
    return {
      ...node,
      points: pts
    };
  });

  return (
    <div className="relative w-full h-full bg-transparent text-[#002f87] p-8 flex flex-col justify-between overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            Siloam Hospitals Ambon
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-[#b0841a] tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-150/20">
            BUSINESS STRATEGY ROADMAP
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 z-10 flex-shrink-0">
        <h2 className="text-4xl font-black text-[#003399] tracking-tight flex items-center">
          <CalendarRange className="w-8 h-8 mr-3 text-amber-500" />
          {safeData.title}
        </h2>
      </div>

      {/* Interactive Timeline */}
      <div className="flex-1 w-full relative z-10 flex items-center justify-center my-auto">
        <div className="relative w-full max-w-4xl h-[400px]">
          
          {/* Dashed Line Background */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-[#002f87]/50 -translate-y-1/2" />

          {/* Timeline Nodes */}
          {resolvedTimeline.map((item, index) => {
            const leftPercent = (index / (resolvedTimeline.length - 1)) * 100;
            const isTop = item.position === "top";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: isTop ? -30 : 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${leftPercent}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20
                }}
              >
                
                {/* Dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.3 + 0.2, type: "spring" }}
                  className="w-6 h-6 rounded-full bg-[#fbbc04] shadow-lg border-[3px] border-white relative z-10"
                />

                {/* Content Container positioned absolutely relative to the dot */}
                <div className={`absolute ${isTop ? 'bottom-full mb-4' : 'top-full mt-4'} text-left w-64`}>
                  {isTop && (
                    <div className="flex flex-col items-start relative">
                      <div className="inline-block bg-[#002f87] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md">
                        {item.title || `${item.year} at Siloam Ambon`}
                      </div>
                      <ul className="text-sm font-medium leading-tight text-[#002f87] space-y-1.5 pl-1">
                        {item.points.map((pt, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-1.5 mt-[2px] text-blue-500 text-xs">•</span>
                            <span className="whitespace-pre-line">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isTop && (
                    <div className="flex flex-col items-start relative">
                      <div className="inline-block bg-[#002f87] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md">
                        {item.title || `${item.year} at Siloam Ambon`}
                      </div>
                      <ul className="text-sm font-medium leading-tight text-[#002f87] space-y-1.5 pl-1">
                        {item.points.map((pt, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-1.5 mt-[2px] text-blue-500 text-xs">•</span>
                            <span className="whitespace-pre-line">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs z-10 flex-shrink-0">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || 13} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
