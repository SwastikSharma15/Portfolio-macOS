"use client";

import React, { useState } from "react";
import useWindowStore from "#store/window";
import { Smartphone, QrCode, ArrowUpRight, MonitorSmartphone } from "lucide-react";

export const IosWidget: React.FC = React.memo(() => {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [showQr, setShowQr] = useState(false);
  const mobileUrl = "https://swastikmacolio.in";

  const handleLaunchSimulator = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    openWindow("simulator" as any, null, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  return (
    <aside
      className="ios-widget fixed top-24 right-8 z-20 w-80 bg-black/40 backdrop-blur-3xl border border-white/15 rounded-[26px] p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none hover:border-white/25 transition-all duration-300 group"
      data-widget="ios-guidance"
    >
      {/* Top Sonoma Widget Category Bar */}
      <div className="flex items-center justify-between mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        <div className="flex items-center space-x-1.5 text-gray-300">
          <MonitorSmartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>iPhone Mirroring</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex items-center space-x-3 bg-white/5 rounded-2xl p-3 border border-white/10 mb-3 group-hover:bg-white/[0.08] transition-colors">
        {/* iPhone Mini Mockup Illustration */}
        <div className="relative w-12 h-20 bg-black rounded-2xl border-2 border-gray-600/60 p-1 flex flex-col justify-between items-center shadow-lg shrink-0 overflow-hidden">
          <div className="w-4 h-1 bg-gray-700 rounded-full" />
          <div className="w-full flex-1 bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 rounded-xl my-1 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white/80 animate-pulse" />
          </div>
          <div className="w-6 h-0.5 bg-gray-500 rounded-full" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white tracking-tight truncate">
            iOS Mobile Version
          </h4>
          <p className="text-xs text-gray-300 mt-0.5 truncate font-medium">
            swastikmacolio.in
          </p>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-tight">
            Preview the responsive iOS mobile layout right inside macOS.
          </p>
        </div>
      </div>

      {/* QR Code Drawer */}
      {showQr ? (
        <div className="mb-3 p-3 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-center animate-fadeIn border border-white/10">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
              mobileUrl
            )}`}
            alt="Mobile QR Code"
            className="w-24 h-24 rounded-lg bg-white p-1 mb-1.5 shadow-md"
          />
          <p className="text-[10px] text-gray-300 font-medium">Scan with your smartphone</p>
        </div>
      ) : null}

      {/* Bottom Action Controls (macOS Sonoma Pill Buttons) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleLaunchSimulator}
          className="flex-1 flex items-center justify-center space-x-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-medium text-xs py-2 px-3 rounded-full transition-all duration-150 cursor-pointer border border-white/15"
        >
          <span>Open Preview</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
        </button>

        <button
          type="button"
          onClick={() => setShowQr(!showQr)}
          title="Toggle QR Code"
          className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full active:scale-95 transition-all duration-150 cursor-pointer border border-white/10"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
});

IosWidget.displayName = "IosWidget";

export default IosWidget;
