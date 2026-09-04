"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWindowStore from "#store/window";
import {
  Smartphone,
  ArrowUpRight,
  QrCode,
  BatteryCharging,
  Wifi,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export const IosWidget: React.FC = React.memo(() => {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const mobileUrl = "https://swastikmacolio.in";

  const handleLaunchSimulator = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      openWindow("simulator" as any, null, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    },
    [openWindow]
  );

  const handleCopyLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mobileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [mobileUrl]);

  return (
    <motion.aside
      drag
      dragConstraints={{ top: -60, left: -700, right: 20, bottom: 600 }}
      dragElastic={0.05}
      dragMomentum={false}
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      className="ios-widget fixed top-20 right-8 z-30 select-none cursor-default"
      data-widget="ios-guidance"
    >
      {/* Light Crystal Glassmorphism Outer Chamber (GPU-accelerated, single composite blur) */}
      <div className="w-[325px] rounded-[28px] bg-white/50 backdrop-blur-2xl border border-white/70 p-4 text-slate-800 shadow-[0_20px_45px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.04)] hover:border-white/90 transition-[border-color,box-shadow] duration-200">
        
        {/* Top Header: Explicit "iOS Mobile Preview" Category & Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/60">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-slate-800 tracking-tight">
                iOS Mobile Preview
              </span>
            </div>
          </div>

          {/* iOS 18 Badge */}
          <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-0.5 rounded-full border border-white/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-bold text-slate-700 tracking-wide">iOS 18</span>
          </div>
        </div>

        {/* Middle Feature Card: Optimized Single-Pass Glass (No nested blur penalty) */}
        <div className="mt-3 bg-white/65 rounded-2xl p-3 border border-white/85 shadow-xs">
          <div className="flex items-center gap-3">
            
            {/* Visual Mini iPhone Chassis Peek (Instant recognizable hint that this is iOS!) */}
            <div className="w-[46px] h-[84px] rounded-[13px] bg-slate-900 border-[2px] border-slate-300/90 shadow-sm p-0.5 flex flex-col justify-between shrink-0 overflow-hidden relative group/phone">
              
              {/* Dynamic Island Notch */}
              <div className="w-4 h-1 bg-black rounded-full mx-auto mt-0.5 ring-1 ring-white/10" />

              {/* Simulated Mini iOS Screen */}
              <div className="flex-1 my-0.5 rounded-[9px] bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-950 p-1 flex flex-col justify-between relative overflow-hidden">
                {/* Diagonal Glass Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent pointer-events-none" />

                {/* Mini App Icons Grid */}
                <div className="grid grid-cols-2 gap-0.5 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                </div>

                {/* Mini Bottom Dock */}
                <div className="bg-white/20 rounded-full py-0.5 px-1 flex justify-around">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-5 h-0.5 bg-white/60 rounded-full mx-auto mb-0.5" />
            </div>

            {/* Clear iOS Explanation & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60">
                  Mobile Version
                </span>
              </div>

              <h4 className="text-[13.5px] font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                Swastik’s iPhone
              </h4>

              <p className="text-[11px] font-semibold text-blue-600 truncate font-mono">
                swastikmacolio.in
              </p>

              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                Touch-first responsive iOS layout with mobile apps & gestures.
              </p>
            </div>
          </div>

          {/* Micro Device Telemetry */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] font-medium text-slate-500">
            <div className="flex items-center gap-1 text-slate-600">
              <BatteryCharging className="w-3 h-3 text-emerald-600" />
              <span>94% Battery</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Wifi className="w-2.5 h-2.5 text-blue-500" />
              <span>Low Latency AirPlay</span>
            </div>
          </div>
        </div>

        {/* Optional Expandable QR Drawer */}
        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-white/80 rounded-2xl p-3 border border-white/95 flex flex-col items-center shadow-xs"
            >
              <div className="flex items-center justify-between w-full mb-2 text-[11px] font-medium text-slate-600">
                <span>Scan with your smartphone</span>
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200/80 mb-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    mobileUrl
                  )}`}
                  alt="Mobile QR Code"
                  width={100}
                  height={100}
                  decoding="async"
                  loading="lazy"
                  className="w-20 h-20 rounded"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-[11px] font-medium rounded-lg transition-all border border-slate-200/80 shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={mobileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open directly in new browser tab"
                  className="p-1.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 hover:text-slate-900 rounded-lg transition-all border border-slate-200/80 shadow-xs flex items-center justify-center cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mt-3 pt-0.5">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleLaunchSimulator}
            className="flex-1 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all cursor-pointer border border-blue-400/30"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Launch iOS Simulator</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
          </button>

          {/* Toggle QR Code */}
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            title="Scan QR on physical device"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
              showQr
                ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                : "bg-white/70 hover:bg-white/90 text-slate-700 border-white/80 shadow-2xs"
            }`}
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.aside>
  );
});

IosWidget.displayName = "IosWidget";

export default IosWidget;
