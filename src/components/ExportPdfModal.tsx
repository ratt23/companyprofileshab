import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { toJpeg } from "html-to-image";
import { Download, Eye, EyeOff, Lock, RefreshCw, X, AlertCircle } from "lucide-react";
import { SlideConfigItem } from "../types";

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlides: SlideConfigItem[];
  renderSlide: (slideId: string, pageNumber: number) => React.ReactNode;
}

const EXPORT_PASSWORD = "rattratt23#";
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  activeSlides,
  renderSlide,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Exclude Social Media slide (embeds external Elfsight/Google widgets that block CORS)
  const exportableSlides = activeSlides.filter((slide) => slide.id !== "socials");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShowPassword(false);
      setError("");
      setIsExporting(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [isOpen]);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExporting) return;

    if (password !== EXPORT_PASSWORD) {
      setError("Password salah. Silakan masukkan password yang benar.");
      return;
    }

    setError("");
    setIsExporting(true);
    setProgress({ current: 0, total: exportableSlides.length });

    // Give off-screen slides time to mount, load images, and finish initial render
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [SLIDE_WIDTH, SLIDE_HEIGHT],
        hotfixes: ["px_scaling"],
      });

      for (let i = 0; i < exportableSlides.length; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;

        setProgress({ current: i + 1, total: exportableSlides.length });

        const dataUrl = await toJpeg(el, {
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          pixelRatio: 1.5,
          quality: 0.92,
          backgroundColor: "#ffffff",
          imagePlaceholder:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        });

        if (i > 0) {
          pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
        }
        pdf.addImage(dataUrl, "JPEG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, undefined, "FAST");
      }

      pdf.save("RSU-Siloam-Ambon-Slides.pdf");
      setIsExporting(false);
      onClose();
    } catch (err) {
      console.error("Gagal export PDF:", err);
      setError("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B19]/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-[#FAF8F4] text-[#1C1B19] rounded-[24px] border border-black/[0.08] shadow-[0_24px_60px_rgba(28,27,25,0.28)] overflow-hidden">
          {/* Header */}
          <div className="bg-[#1C1B19] text-[#FAF8F4] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F4CF5D] text-[#1C1B19] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight">Export Slide ke PDF</h2>
                <p className="text-[11px] text-[#FAF8F4]/70">
                  {exportableSlides.length} slide siap diunduh (tanpa slide Social Media)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#FAF8F4]/80 hover:text-white transition-colors disabled:opacity-40"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleExport} className="p-6 space-y-4">
            <p className="text-xs text-[#6F6A61] leading-relaxed">
              Masukkan password otorisasi sebelum mengunduh seluruh presentasi{" "}
              <span className="font-bold text-[#1C1B19]">RSU Siloam Ambon</span> dalam format PDF.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#6F6A61]">
                Password Export
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isExporting}
                  autoFocus
                  placeholder="Masukkan password..."
                  className="w-full bg-[#F6F3EC] border border-black/[0.1] rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-[#1C1B19] placeholder:text-[#6F6A61]/60 outline-none focus:border-[#2F6A57] transition-colors disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A61] hover:text-[#1C1B19]"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C4532E] bg-[#C4532E]/10 border border-[#C4532E]/20 rounded-xl px-3.5 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isExporting && (
              <div className="space-y-2 bg-[#F6F3EC] border border-black/[0.06] rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#1C1B19]">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F6A57]" />
                    Memproses PDF...
                  </span>
                  <span className="tabular-nums text-[#2F6A57]">
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2F6A57] transition-all duration-300"
                    style={{
                      width: `${progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#6F6A61] hover:bg-black/5 transition-colors disabled:opacity-40"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isExporting || !password.trim()}
                className="px-5 py-2 rounded-full bg-[#1C1B19] hover:bg-[#32302C] text-[#FAF8F4] text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#F4CF5D]" />
                <span>{isExporting ? "Mengexport..." : "Download PDF"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Off-screen 16:9 Slide Render Stage during export */}
      {isExporting && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-20000px",
            top: 0,
            width: `${SLIDE_WIDTH}px`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          {exportableSlides.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              style={{
                width: `${SLIDE_WIDTH}px`,
                height: `${SLIDE_HEIGHT}px`,
              }}
              className="relative bg-white overflow-hidden flex flex-col justify-between"
            >
              {renderSlide(slide.id, idx + 1)}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
