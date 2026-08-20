"use client";

import React from "react";
import WindowControls from "../WindowControls";
import WindowWrapper from "#hoc/WindowWrapper";

const IosSimulator: React.FC = () => {
  const mobileUrl = "https://swastikmacolio.in";

  return (
    <div className="flex flex-col h-[82vh] min-h-[760px] max-h-[920px] w-[420px] min-w-[320px] max-w-[600px] bg-[#f5f5f7] text-gray-900 rounded-xl overflow-hidden shadow-2xl border border-black/10 select-none">
      {/* macOS Window Header Bar (Light Mode) */}
      <div className="window-header flex items-center justify-between px-4 py-2.5 bg-[#e5e5e7]/90 backdrop-blur-md border-b border-black/10 cursor-grab active:cursor-grabbing shrink-0">
        <WindowControls target="simulator" />
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>swastikmacolio.in</span>
        </div>
        <div className="w-14" />
      </div>

      {/* Simulator Device Frame Container */}
      <div className="flex-1 relative flex items-center justify-center p-3 bg-[#e8e8ed] overflow-hidden">
        {/* Mobile Device Chassis Frame (Dark Mode, No Island Notch) */}
        <div className="relative w-full h-full bg-black rounded-[42px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-[4px] border-[#38383a] flex flex-col overflow-hidden">
          {/* Mobile Webframe Viewport loading swastikmacolio.in */}
          <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex flex-col pointer-events-auto select-auto">
            <iframe
              src={mobileUrl}
              title="swastikmacolio.in Mobile Site"
              className="w-full h-full border-0 pointer-events-auto"
              data-clickable="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowWrapper(IosSimulator, "simulator" as any);
