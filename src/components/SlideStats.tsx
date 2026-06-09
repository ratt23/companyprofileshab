import React, { useState } from "react";
import { motion } from "motion/react";
import { YearStats } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Users, ShieldPlus, UserCheck, Calendar } from "lucide-react";

interface SlideStatsProps {
  stats: YearStats[];
  statsMeta?: {
    subtitle: string;
    title: string;
    description: string;
  };
  pageNumber?: number;
  totalPages?: number;
}

export function SlideStats({ stats, statsMeta, pageNumber, totalPages }: SlideStatsProps) {
  const [selectedYearIndex, setSelectedYearIndex] = useState(2); // Default to 2025 (latest)

  const activeStats = stats[selectedYearIndex] || stats[stats.length - 1];

  // Map the stats for recharts representation
  const chartData = stats.map(s => ({
    name: s.year,
    "Rawat Jalan": s.outpatient,
    "Rawat Inap": s.inpatient,
    "Jumlah Operasi": s.surgical,
    "Emergency": s.emergency,
    "Medical Check Up": s.mcu
  }));

  const formatNumber = (num: number) => {
    return num.toLocaleString("id-ID");
  };

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">
      {/* Slide Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            RSU SIloam Ambon
          </span>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {stats.map((s, idx) => (
            <button
              key={s.year}
              onClick={() => setSelectedYearIndex(idx)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-transform ${
                selectedYearIndex === idx
                  ? "bg-[#002f87] text-white shadow"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              YTD {s.year}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto z-10 items-stretch">
        
        {/* Left column: Key Metrics Cards for active Year */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div>
            <h3 className="text-md uppercase font-extrabold text-[#b0841a] tracking-wider flex items-center">
              <TrendingUp className="w-5 h-5 mr-1.5" />
              {statsMeta?.subtitle || "TREN DAN STATISTIK KINERJA"}
            </h3>
            <h2 className="text-4xl font-extrabold text-[#003399] tracking-tight text-sans leading-tight">
              {(statsMeta?.title || "Kunjungan Pasien {year}").replace("{year}", activeStats?.year || "")}
            </h2>
            <p className="text-xs text-slate-400">
              {(statsMeta?.description || "YTD Jan to Dec {year} di Siloam Ambon. Terintegrasi langsung dengan database hospital.").replace("{year}", activeStats?.year || "")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Outpatient card */}
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500 rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Rawat Jalan</div>
                <div className="text-xl font-black text-emerald-900 font-sans tracking-tight">
                  {formatNumber(activeStats?.outpatient || 0)}
                </div>
              </div>
            </div>

            {/* Inpatient card */}
            <div className="bg-blue-50/40 border border-blue-150 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="p-2.5 bg-[#002f87] rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Rawat Inap</div>
                <div className="text-xl font-black text-[#002f87] font-sans tracking-tight">
                  {formatNumber(activeStats?.inpatient || 0)}
                </div>
              </div>
            </div>

            {/* Surgical Procedures card */}
            <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500 rounded-lg text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Bedah/Operasi</div>
                <div className="text-xl font-black text-amber-900 font-sans tracking-tight">
                  {formatNumber(activeStats?.surgical || 0)}
                </div>
              </div>
            </div>

            {/* Emergency card */}
            <div className="bg-red-50/40 border border-red-100 rounded-xl p-3.5 flex items-center space-x-3">
              <div className="p-2.5 bg-red-500 rounded-lg text-white">
                <ShieldPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Emergency (IGD)</div>
                <div className="text-xl font-black text-red-900 font-sans tracking-tight">
                  {formatNumber(activeStats?.emergency || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Check Up bar */}
          <div className="bg-sky-50/40 border border-sky-100 rounded-xl p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-500 rounded-lg text-white">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">Medical Check Up (MCU)</div>
                <div className="text-xs text-sky-600">Skrining kesehatan pre-emptive</div>
              </div>
            </div>
            <div className="text-lg font-black text-sky-900">
              {formatNumber(activeStats?.mcu || 0)}
            </div>
          </div>
        </div>

        {/* Right column: Interactive Recharts Bar Chart mapping page 3 PPT */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-2xl p-5 flex flex-col justify-between" style={{ minHeight: "300px" }}>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              GRAFIK TAHUNAN (2023 - 2025)
            </h4>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono mb-4 text-slate-500">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-[#10b981] rounded-sm mr-1"></span> Rawat Jalan</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-[#002f87] rounded-sm mr-1"></span> Rawat Inap</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-sm mr-1"></span> Jumlah Operasi</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-[#fca5a5] rounded-sm mr-1"></span> Emergency</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-[#38bdf8] rounded-sm mr-1"></span> Medical Check Up</span>
            </div>
          </div>

          <div className="flex-grow w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [formatNumber(value), name]}
                  contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold", color: "#94a3b8" }}
                />
                <Bar dataKey="Rawat Jalan" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rawat Inap" fill="#002f87" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Jumlah Operasi" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Emergency" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medical Check Up" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-right">
            * Kenaikan konsisten mencerminkan perluasan jangkauan wilayah Ambon dan sekitarnya.
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs z-10">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || 3} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
