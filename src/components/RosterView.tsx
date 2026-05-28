import React, { useState } from "react";
import { Doctor } from "../types";
import { Search, Calendar, Stethoscope, Clock, X, Sparkles, Filter } from "lucide-react";

interface RosterViewProps {
  doctors: Doctor[];
  onClose: () => void;
}

export function RosterView({ doctors, onClose }: RosterViewProps) {
  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState("ALL");

  const daysOfWeek = ["ALL", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  
  // Extract unique list of specialties
  const specialties = ["ALL", ...Array.from(new Set(doctors.map(d => d.specialty)))];

  // Filter conditions
  const filtered = doctors.filter(doc => {
    // 1. query check
    const matchesQuery = doc.name.toLowerCase().includes(query.toLowerCase()) || 
                         doc.department.toLowerCase().includes(query.toLowerCase());
    
    // 2. Specialty check
    const matchesSpec = selectedSpecialty === "ALL" || doc.specialty === selectedSpecialty;

    // 3. Day schedule check
    const matchesDay = selectedDay === "ALL" || doc.schedule[selectedDay] !== undefined;

    return matchesQuery && matchesSpec && matchesDay;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#002f8d] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-black tracking-tight">Interactive Doctor Roster Database</h2>
              <p className="text-xs text-white/70">Pencarian jadwal praktek harian dokter spesialis lengkap RSU Siloam Ambon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar Area */}
        <div className="bg-slate-50 border-b border-slate-100 p-5 shrink-0 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-center">
            
            {/* Search inputs */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="Cari Dokter berdasarkan nama..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-405"
              />
              <Search className="w-4 h-4 text-slate-420 absolute left-3 top-2.5" />
            </div>

            {/* Specialty Picker */}
            <div className="md:col-span-5 flex items-center space-x-2">
              <span className="text-slate-400 font-bold shrink-0">SPESIALIS:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-705"
              >
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Day selector */}
            <div className="md:col-span-3 flex items-center space-x-2">
              <span className="text-slate-400 font-bold shrink-0">HARI:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-705"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Active metrics bar */}
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Ditemukan: <span className="font-bold text-[#003399]">{filtered.length} Dokter</span> matching filter</span>
            { (selectedSpecialty !== "ALL" || selectedDay !== "ALL" || query !== "") && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedSpecialty("ALL");
                  setSelectedDay("ALL");
                }}
                className="text-red-500 hover:text-red-600 font-bold font-sans flex items-center"
              >
                <X className="w-3 h-3 mr-1" /> Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Doctor lists scrolling dashboard */}
        <div className="flex-grow overflow-y-auto p-5 space-y-2.5 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(doc => {
              const activeOnDay = selectedDay !== "ALL";
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md flex items-start space-x-4 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all select-none"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#003399]/10 rounded-xl flex items-center justify-center text-[#ff3300]">
                    <Stethoscope className="w-6 h-6 text-[#002f8c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-800 leading-snug truncate">
                        {doc.name}
                      </h4>
                      <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100/30 font-bold shrink-0">
                        {doc.department}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-mono">
                      {doc.specialty}
                    </p>

                    <div className="mt-3 leading-6 border-t border-slate-50 pt-2.5">
                      <span className="text-[9px] font-bold text-[#b0841a] block mb-1 font-mono uppercase">
                        Schedules & Hours:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.keys(doc.schedule).map(day => (
                          <div
                            key={day}
                            className={`flex justify-between items-center text-[10px] p-1 rounded ${
                              activeOnDay && day === selectedDay
                                ? "bg-amber-500/10 border border-amber-500/30 text-amber-900 font-black"
                                : "bg-slate-50 text-slate-500 border border-slate-100/70"
                            }`}
                          >
                            <span>{day}</span>
                            <span className="font-mono">{doc.schedule[day]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <p className="text-sm font-semibold select-none">Tidak ada jadwal dokter yang cocok dengan filter Anda.</p>
                <p className="text-xs text-slate-400 mt-1 select-none">Silakan ubah nama pencarian, specialty, atau hari filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Close triggers */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#002f8d] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            Selesai Viewing Roster
          </button>
        </div>

      </div>
    </div>
  );
}
