import React from 'react';
import { dockApps, locations } from '#constants';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import clsx from 'clsx';

// Pinned iOS dock apps
const IOS_DOCK_APP_IDS = ['safari', 'terminal', 'contact', 'music'];

const IosDock = () => {
  const openWindow = useWindowStore((state: any) => state.openWindow);
  const setActiveLocation = useLocationStore((state: any) => state.setActiveLocation);
  
  const iosDockApps = dockApps.filter(app => IOS_DOCK_APP_IDS.includes(app.id));

  const handleOpenApp = (app: any) => {
    if (!app.canOpen) return;

    if (app.id === 'finder') {
      openWindow('finder');
      setActiveLocation(locations.work);
      return;
    }

    openWindow(app.id);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px]">
      <div className="bg-white/30 backdrop-blur-xl rounded-[2.5rem] p-4 flex justify-around items-center shadow-lg border border-white/20">
        {iosDockApps.map((app) => (
          <button 
            key={app.id}
            onClick={() => handleOpenApp(app)}
            className="flex flex-col items-center justify-center space-y-1 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={`/images/${app.icon}`} 
                alt={app.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IosDock;
