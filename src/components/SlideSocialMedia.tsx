import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Instagram, MapPin, Phone, Globe, Star, Users, Compass, Facebook } from "lucide-react";
import { SocialsSlide } from "../types";
import { useSlideStore } from "../store/useStore";

export function SlideSocialMedia({ data, pageNumber, totalPages }: { data?: SocialsSlide; pageNumber?: number; totalPages?: number }) {
  const { socialRealtimeData, fetchSocialStats } = useSlideStore();

  useEffect(() => {
    fetchSocialStats();
  }, [fetchSocialStats]);

  const safeData = data || {
    phone: "1-500-181",
    instagram: "siloamhospitals",
    facebook: "Siloam Hospitals",
    website: "siloamhospitals.com",
    igWidget: '<div class="elfsight-app-3c8fe8ac-3573-41c7-8021-843c986bcdcc" data-elfsight-app-lazy></div>',
    googleWidget: '<div class="elfsight-app-059beb55-6694-4f74-8a8d-57514994e975" data-elfsight-app-lazy></div>'
  };

  const gData = socialRealtimeData?.google || {
    rating: 4.8,
    reviewsCount: "1.5K",
    status: "Rumah Sakit • Buka 24 Jam"
  };

  const igData = socialRealtimeData?.instagram || [];

  return (
    <div className="relative w-full h-full bg-transparent text-slate-800 p-8 flex flex-col justify-between overflow-hidden">
      
      {/* Brand logo header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Siloam Hospitals" className="h-6 w-auto object-contain" />
          <span className="text-xs text-slate-400 font-mono font-semibold border-l border-slate-200 pl-3">
            RSU SIloam Ambon
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-[#b0841a] tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-150/20">
            CONNECT WITH US
          </span>
        </div>
      </div>

      {/* Main Grid: Instagram & Google My business in phone mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto z-10 py-4 items-center max-w-5xl mx-auto w-full">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full relative flex flex-col justify-center min-h-[400px]"
        >
          {/* Elfsight Instagram Feed */}
          {safeData.igWidget ? (
            <div dangerouslySetInnerHTML={{ __html: safeData.igWidget }} />
          ) : (
            <div className="elfsight-app-3c8fe8ac-3573-41c7-8021-843c986bcdcc" data-elfsight-app-lazy></div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full relative flex flex-col justify-center min-h-[400px]"
        >
          {/* Elfsight Google Reviews */}
          {safeData.googleWidget ? (
            <div dangerouslySetInnerHTML={{ __html: safeData.googleWidget }} />
          ) : (
            <div className="elfsight-app-059beb55-6694-4f74-8a8d-57514994e975" data-elfsight-app-lazy></div>
          )}
        </motion.div>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-slate-400 text-xs">
        <span>#BersamaSiloam</span>
        <span className="font-mono">Page {pageNumber || 45} / {totalPages || 45}</span>
      </div>
    </div>
  );
}
