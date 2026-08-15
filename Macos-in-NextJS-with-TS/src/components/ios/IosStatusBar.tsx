import React, { useState, useEffect } from 'react';
import { Battery, Wifi, SignalHigh } from 'lucide-react';

const IosStatusBar = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes: string | number = now.getMinutes();
      
      hours = hours % 12;
      hours = hours ? hours : 12; 
      minutes = minutes < 10 ? '0' + minutes : minutes;
      
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-12 flex justify-between items-center px-6 text-white z-50 absolute top-0 left-0 pt-2 font-semibold text-sm pointer-events-none">
      <div className="flex-1 flex justify-start">
        <span>{time}</span>
      </div>
      
      {/* Dynamic Island Placeholder */}
      <div className="w-24 h-7 bg-black rounded-full shadow-md flex-shrink-0" />
      
      <div className="flex-1 flex justify-end items-center space-x-2">
        <SignalHigh size={16} />
        <Wifi size={16} />
        <Battery size={18} />
      </div>
    </div>
  );
};

export default IosStatusBar;
