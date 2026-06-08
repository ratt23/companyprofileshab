import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Home, Activity, CheckSquare, Stethoscope, Briefcase, Sparkles, Star, Award, HeartHandshake } from "lucide-react";
import { HospitalFacility } from "../types";
import { getProxiedImageUrl } from "../utils/imageUtils";

interface SlideFacilitiesProps {
  page: 1 | 2 | 3 | 4 | 5; // Corresponding to Pages 4, 5, 6, 7, 8
  facilities: HospitalFacility[];
  pageNumber?: number;
  totalPages?: number;
}

export function SlideFacilities({ page, facilities, pageNumber, totalPages }: SlideFacilitiesProps) {
  // Use index-based slicing instead of hardcoded IDs
  // so any facilities added from the dashboard will always display
  const getPageData = () => {
    switch (page) {
      case 1: {
        const page1Ids = ["facility-emergency", "facility-siloam-home"];
        const items = page1Ids.map(id => facilities.find(f => f.id === id)).filter(Boolean) as HospitalFacility[];
        return {
          title: "Our Facilities",
          subtitle: "EMERGENCY & COMMUNITY SERVICES",
          items,
          colClass: items.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        };
      }
      case 2: {
        const page2Ids = ["facility-radiology", "facility-outpatient"];
        const items = page2Ids.map(id => facilities.find(f => f.id === id)).filter(Boolean) as HospitalFacility[];
        return {
          title: "Our Facilities",
          subtitle: "DIAGNOSTIC & SPECIALIST OUTPATIENT",
          items,
          colClass: items.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        };
      }
      case 3: {
        const page3Ids = ["facility-inpatient", "facility-ambulance"];
        const items = page3Ids.map(id => facilities.find(f => f.id === id)).filter(Boolean) as HospitalFacility[];
        return {
          title: "Our Facilities",
          subtitle: "PRIMARY RESCUE & GENERAL INPATIENT",
          items,
          colClass: items.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        };
      }
      case 4: {
        const page4Ids = ["facility-vvip", "facility-vip", "facility-kelas-1"];
        const items = page4Ids.map(id => facilities.find(f => f.id === id)).filter(Boolean) as HospitalFacility[];
        return {
          title: "Our Facilities",
          subtitle: "INPATIENT WARDS - PRIVATE & PREMIUM",
          items,
          colClass: items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3",
        };
      }
      case 5: {
        const page5Ids = ["facility-kelas-2", "facility-kelas-3"];
        const items = page5Ids.map(id => facilities.find(f => f.id === id)).filter(Boolean) as HospitalFacility[];
        return {
          title: "Our Facilities",
          subtitle: "INPATIENT WARDS - GENERAL",
          items,
          colClass: items.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2",
        };
      }
    }
  };

  const { title, subtitle, items, colClass } = getPageData();

  // Pick nice icons for each facility card based on its id
  const getFacilityIcon = (id: string) => {
    switch (id) {
      case "facility-emergency":
        return <ShieldAlert className="w-8 h-8 text-white" />;
      case "facility-siloam-home":
        return <Home className="w-8 h-8 text-white" />;
      case "facility-radiology":
        return <Activity className="w-8 h-8 text-white" />;
      case "facility-outpatient":
        return <Stethoscope className="w-8 h-8 text-white" />;
      case "facility-inpatient":
        return <HeartHandshake className="w-8 h-8 text-white" />;
      case "facility-ambulance":
        return <Briefcase className="w-8 h-8 text-white" />;
      case "facility-vvip":
        return <Star className="w-8 h-8 text-amber-500 fill-amber-500" />;
      case "facility-vip":
        return <Star className="w-8 h-8 text-sky-500 fill-sky-500" />;
      case "facility-kelas-1":
        return <Award className="w-8 h-8 text-slate-500" />;
      case "facility-kelas-2":
        return <CheckSquare className="w-8 h-8 text-[#0a66c2]" />;
      case "facility-kelas-3":
        return <CheckSquare className="w-8 h-8 text-emerald-600" />;
      default:
        return <Sparkles className="w-8 h-8 text-white" />;
    }
  };

  // Select matching premium gradient/visual representation cards
  const getCardBg = (id: string) => {
    switch (id) {
      case "facility-emergency":
        return "from-red-650 to-red-900 border-red-200/50 bg-red-50/20";
      case "facility-siloam-home":
        return "from-[#0a46a3] to-[#00205b] border-blue-200/50 bg-blue-50/20";
      case "facility-radiology":
        return "from-slate-700 to-slate-900 border-slate-200/50 bg-slate-50/20";
      case "facility-outpatient":
        return "from-sky-700 to-sky-950 border-sky-200/50 bg-sky-50/20";
      case "facility-inpatient":
        return "from-[#0d4ea5] to-[#002f8a] border-indigo-200/50 bg-indigo-50/20";
      case "facility-ambulance":
        return "from-[#0b66c2] to-[#013570] border-cyan-200/50 bg-cyan-50/20";
      default:
        return "from-white to-slate-50 border-slate-150 text-slate-800";
    }
  };

  const isSpecialtyCard = (id: string) => {
    return [
      "facility-emergency",
      "facility-siloam-home",
      "facility-radiology",
      "facility-outpatient",
      "facility-inpatient",
      "facility-ambulance"
    ].includes(id);
  };

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            Siloam Hospitals Ambon
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#b0841a] tracking-widest uppercase">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 mb-4 z-10">
        <h2 className="text-4xl font-extrabold text-[#003399] tracking-tight">
          {title}
        </h2>
      </div>

      {/* Action Content Box */}
      {(() => {
        const hasAnyDescription = items.some(item => item.description && item.description.trim() !== '');
        const gridHeightClass = hasAnyDescription ? "h-full py-4" : "h-auto my-auto py-2";
        return (
          <div className={`grid ${colClass} gap-6 my-auto z-10 items-stretch ${gridHeightClass}`}>
            {items.map((facility, index) => {
          const facilityImage = (facility as any).imageUrl || (facility as any).image || '';
          const hasPhoto = !!facilityImage;
          // For items that came from VVIP/VIP/Kelas rooms (no hardcoded bg color), use photo or white card
          const isSpecialty = isSpecialtyCard(facility.id);
          const cardClass = (hasPhoto || !isSpecialty)
            ? "bg-white text-slate-800 border-slate-100 shadow-xl shadow-slate-100/70"
            : `bg-gradient-to-br ${getCardBg(facility.id)} text-white shadow-2xl shadow-blue-900/10`;
          const darkText = hasPhoto || !isSpecialty;

          // Support both specs and features fields
          const specItems: string[] = facility.specs || (facility as any).features || [];

          return (
            <motion.div
              key={facility.id || index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl border flex flex-col transition-all relative overflow-hidden group max-w-[480px] w-full mx-auto ${cardClass}`}
            >
              {hasPhoto && (
                <div className="w-full overflow-hidden flex-shrink-0 border-b border-slate-100 relative">
                  <img
                    src={getProxiedImageUrl(facilityImage)}
                    alt={facility.title}
                    className="w-full h-auto block"
                  />
                </div>
              )}

              {/* Overlay abstract design (only when no photo) */}
              {!hasPhoto && (
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none scale-150 group-hover:scale-175 transition-transform" />
              )}

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  {/* Icon + Category badge */}
                  <div className="flex justify-between items-center mb-3">
                    {!hasPhoto && (
                      <div className={`p-3 rounded-xl ${darkText ? 'bg-[#f4f7fc]' : 'bg-white/10'}`}>
                        {getFacilityIcon(facility.id)}
                      </div>
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-auto ${
                      darkText ? 'bg-sky-50 text-sky-700' : 'bg-white/20 text-white'
                    }`}>
                      {facility.category}
                    </span>
                  </div>

                  <h3 className={`text-xl font-black tracking-tight mb-2 ${darkText ? 'text-[#002f8a]' : 'text-white'}`}>
                    {facility.title}
                  </h3>
                  {facility.description && (
                    <p className={`text-xs leading-relaxed ${darkText ? 'text-slate-500' : 'text-white/80'}`}>
                      {facility.description}
                    </p>
                  )}
                </div>

                {specItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-150/30">
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkText ? 'text-slate-400' : 'text-white/60'}`}>
                      Fasilitas Tersedia:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {specItems.map((spec, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2.5 py-1 rounded-md font-sans ${
                            darkText
                              ? 'bg-slate-50 text-slate-600 border border-slate-100'
                              : 'bg-white/15 text-white border border-white/5'
                          }`}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      );
      })()}

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || (3 + page)} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
