import React from "react";
import { PartnerSlide } from "../types";
import { getProxiedImageUrl } from "../utils/imageUtils";

export function SlidePartner({ data, pageNumber, totalPages }: { data?: PartnerSlide; pageNumber?: number; totalPages?: number }) {
  const safeData = data || {
    id: "default",
    title: "Our Partner",
    subtitle: "",
    logos: []
  };

  const titleText = safeData.title || "Our Partner";
  const words = titleText.split(" ");
  const line1 = words[0] || "";
  const line2 = words.slice(1).join(" ");

  // Filter out empty logos so we only display actual uploaded logos
  const activeLogos = (safeData.logos || []).filter(url => !!url);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden font-sans select-none flex items-center justify-between px-16">
      {/* Top Left Logo */}
      <div className="absolute top-8 left-12 z-10">
        <img src="/logo.png" alt="RSU Siloam" className="h-8 w-auto object-contain" />
      </div>

      {/* Left side: Slide Title */}
      <div className="w-[25%] shrink-0 z-10 flex flex-col justify-center">
        <h1 className="text-6xl md:text-7xl font-black text-[#002f87] leading-[0.95] tracking-tight">
          {line1}
          {line2 && (
            <>
              <br />
              <span className="text-[#002f87]">{line2}</span>
            </>
          )}
        </h1>
        {safeData.subtitle && (
          <p className="mt-4 text-lg text-[#002f87]/70 font-medium leading-relaxed">
            {safeData.subtitle}
          </p>
        )}
      </div>

      {/* Right side: Logos Grid / Single Large Logo */}
      <div className="w-[72%] z-10 flex items-center justify-center">
        {activeLogos.length > 0 ? (
          activeLogos.length === 1 ? (
            /* Single Large Logo */
            <div className="flex items-center justify-center h-[420px] w-full transition-transform hover:scale-[1.03] duration-300">
              <img 
                src={getProxiedImageUrl(activeLogos[0])} 
                alt="Partner logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const textSpan = parent.querySelector('.fallback-text');
                    if (!textSpan) {
                      const newSpan = document.createElement('span');
                      newSpan.className = 'fallback-text text-lg font-bold text-slate-400 font-sans';
                      newSpan.innerText = 'Partner Logo';
                      parent.appendChild(newSpan);
                    }
                  }
                }}
              />
            </div>
          ) : (
            /* Multiple Logos Flex-Wrap (Floating/transparent, no card container, centered) */
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 w-full max-h-[90%]">
              {activeLogos.map((logoUrl, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center h-32 w-[240px] transition-transform hover:scale-[1.05] duration-300"
                >
                  <img 
                    src={getProxiedImageUrl(logoUrl)} 
                    alt={`Partner logo ${index + 1}`} 
                    className="max-w-full max-h-28 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const textSpan = parent.querySelector('.fallback-text');
                        if (!textSpan) {
                          const newSpan = document.createElement('span');
                          newSpan.className = 'fallback-text text-xs font-semibold text-slate-400 font-sans';
                          newSpan.innerText = `Partner Logo ${index + 1}`;
                          parent.appendChild(newSpan);
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-slate-400 text-sm italic font-medium">
            Belum ada logo partner yang diupload.
          </div>
        )}
      </div>

      {/* Bottom Left Hashtag */}
      <div className="absolute bottom-8 left-12 z-10">
        <span className="text-sm font-bold text-[#003399] tracking-wide">#BersamaSiloam</span>
      </div>

      {/* Bottom Right Page Numbering */}
      {pageNumber !== undefined && totalPages !== undefined && (
        <div className="absolute bottom-8 right-12 z-10">
          <span className="font-mono text-xs text-[#002f87]/50 bg-[#002f87]/5 px-3 py-1 rounded-full border border-[#002f87]/10">
            Page {pageNumber} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
