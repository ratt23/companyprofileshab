import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { toJpeg } from "html-to-image";
import {
  Download,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  X,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";
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
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const waitForImages = (container: HTMLElement, timeoutMs = 2500) => {
  const imgs = Array.from(container.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();

  return Promise.race([
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          })
      )
    ),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
};

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  activeSlides,
  renderSlide,
}) => {
  // Exclude Social Media slide (embeds external Elfsight/Google widgets that block CORS)
  const exportableSlides = activeSlides.filter((slide) => slide.id !== "socials");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renderingSlide, setRenderingSlide] = useState<{
    id: string;
    pageNumber: number;
  } | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(
        activeSlides.filter((s) => s.id !== "socials").map((s) => s.id)
      );
    } else {
      setPassword("");
      setShowPassword(false);
      setError("");
      setIsExporting(false);
      setRenderingSlide(null);
      setProgress({ current: 0, total: 0, label: "" });
    }
  }, [isOpen, activeSlides]);

  const toggleSlide = (id: string) => {
    if (isExporting) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (isExporting) return;
    if (selectedIds.length === exportableSlides.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(exportableSlides.map((s) => s.id));
    }
  };

  const captureCurrentStage = async (): Promise<string> => {
    const el = stageRef.current;
    if (!el) throw new Error("Stage element not found");

    await waitForImages(el);
    await new Promise((r) => setTimeout(r, 320));

    const baseOptions = {
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      pixelRatio: 1.5,
      quality: 0.9,
      backgroundColor: "#ffffff",
      imagePlaceholder: TRANSPARENT_PIXEL,
    };

    try {
      return await toJpeg(el, baseOptions);
    } catch {
      // Fallback: skip external font embedding if a cross-origin stylesheet blocks fetch
      return await toJpeg(el, {
        ...baseOptions,
        skipFonts: true,
      });
    }
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExporting) return;

    if (password !== EXPORT_PASSWORD) {
      setError("Password salah. Silakan masukkan password yang benar.");
      return;
    }

    const slidesToExport = exportableSlides.filter((s) =>
      selectedIds.includes(s.id)
    );

    if (slidesToExport.length === 0) {
      setError("Pilih minimal 1 slide untuk di-export.");
      return;
    }

    setError("");
    setIsExporting(true);
    setProgress({ current: 0, total: slidesToExport.length, label: "" });

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [SLIDE_WIDTH, SLIDE_HEIGHT],
        hotfixes: ["px_scaling"],
      });

      let addedPages = 0;

      for (let i = 0; i < slidesToExport.length; i++) {
        const slide = slidesToExport[i];
        const originalPageNumber =
          activeSlides.findIndex((s) => s.id === slide.id) + 1;

        setProgress({
          current: i + 1,
          total: slidesToExport.length,
          label: slide.label,
        });

        setRenderingSlide({
          id: slide.id,
          pageNumber: originalPageNumber > 0 ? originalPageNumber : i + 1,
        });

        // Wait for React to mount the single slide into stageRef
        await new Promise((r) => setTimeout(r, 150));

        const dataUrl = await captureCurrentStage();

        if (addedPages > 0) {
          pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
        }
        pdf.addImage(
          dataUrl,
          "JPEG",
          0,
          0,
          SLIDE_WIDTH,
          SLIDE_HEIGHT,
          undefined,
          "FAST"
        );
        addedPages++;
      }

      pdf.save("RSU-Siloam-Ambon-Slides.pdf");
      setRenderingSlide(null);
      setIsExporting(false);
      onClose();
    } catch (err) {
      console.error("Gagal export PDF:", err);
      setError(
        "Terjadi kesalahan saat membuat PDF. Coba kurangi jumlah slide atau coba lagi."
      );
      setRenderingSlide(null);
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const allSelected =
    exportableSlides.length > 0 &&
    selectedIds.length === exportableSlides.length;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B19]/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-lg bg-[#FAF8F4] text-[#1C1B19] rounded-[24px] border border-black/[0.08] shadow-[0_24px_60px_rgba(28,27,25,0.28)] overflow-hidden">
          {/* Header */}
          <div className="bg-[#1C1B19] text-[#FAF8F4] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F4CF5D] text-[#1C1B19] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight">
                  Export Slide ke PDF
                </h2>
                <p className="text-[11px] text-[#FAF8F4]/70">
                  {selectedIds.length} dari {exportableSlides.length} slide
                  dipilih (tanpa Social Media)
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
            {/* Slide Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#6F6A61]">
                  Pilih Slide yang Di-export
                </label>
                <button
                  type="button"
                  onClick={toggleAll}
                  disabled={isExporting}
                  className="text-[11px] font-bold text-[#2F6A57] hover:underline disabled:opacity-50"
                >
                  {allSelected ? "Batal Pilih Semua" : "Pilih Semua"}
                </button>
              </div>

              <div className="max-h-44 overflow-y-auto bg-[#F6F3EC] border border-black/[0.08] rounded-xl p-2 space-y-1">
                {exportableSlides.map((slide, idx) => {
                  const checked = selectedIds.includes(slide.id);
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => toggleSlide(slide.id)}
                      disabled={isExporting}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                        checked
                          ? "bg-[#FAF8F4] text-[#1C1B19] font-semibold shadow-2xs"
                          : "text-[#6F6A61] hover:bg-black/5"
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#2F6A57] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#6F6A61]/60 shrink-0" />
                      )}
                      <span className="truncate">
                        {idx + 1}. {slide.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Input */}
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
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
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
                <div className="flex items-center justify-between text-xs font-bold text-[#1C1B19] gap-2">
                  <span className="flex items-center gap-2 truncate">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2F6A57] shrink-0" />
                    <span className="truncate">
                      {progress.label || "Memproses PDF..."}
                    </span>
                  </span>
                  <span className="tabular-nums text-[#2F6A57] shrink-0">
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2F6A57] transition-all duration-300"
                    style={{
                      width: `${
                        progress.total > 0
                          ? Math.round(
                              (progress.current / progress.total) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-1">
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
                disabled={
                  isExporting || !password.trim() || selectedIds.length === 0
                }
                className="px-5 py-2 rounded-full bg-[#1C1B19] hover:bg-[#32302C] text-[#FAF8F4] text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#F4CF5D]" />
                <span>
                  {isExporting
                    ? "Mengexport..."
                    : `Download PDF (${selectedIds.length})`}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Single-Slide Off-screen Render Stage (prevents memory spike/timeouts) */}
      {isExporting && renderingSlide && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-20000px",
            top: 0,
            width: `${SLIDE_WIDTH}px`,
            height: `${SLIDE_HEIGHT}px`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div
            ref={stageRef}
            key={`${renderingSlide.id}-${renderingSlide.pageNumber}`}
            style={{
              width: `${SLIDE_WIDTH}px`,
              height: `${SLIDE_HEIGHT}px`,
            }}
            className="relative bg-white overflow-hidden flex flex-col justify-between"
          >
            {renderSlide(renderingSlide.id, renderingSlide.pageNumber)}
          </div>
        </div>
      )}
    </>
  );
};
