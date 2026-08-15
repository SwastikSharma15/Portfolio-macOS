import React from 'react';
import { dockApps, locations } from '#constants';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';

const IOS_DOCK_APP_IDS = ['safari', 'terminal', 'contact', 'music'];

const IosHomeScreen = () => {
  const openWindow = useWindowStore((state: any) => state.openWindow);
  const setActiveLocation = useLocationStore((state: any) => state.setActiveLocation);

  // Get apps that are NOT in the dock
  const homeScreenApps = dockApps.filter(app => !IOS_DOCK_APP_IDS.includes(app.id));
  
  // Get projects from locations
  const projects = locations.work?.children ?? [];

  const handleOpenApp = (app: any) => {
    if (!app.canOpen) return;

    if (app.id === 'finder') {
      openWindow('finder');
      setActiveLocation(locations.work);
      return;
    }

    if (app.action === 'trash') {
      openWindow('finder');
      setActiveLocation(locations.trash);
      return;
    }

    openWindow(app.id);
  };

  const handleOpenProject = (project: any) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  return (
    <div className="w-full h-full pt-16 px-6 pb-32 overflow-y-auto">
      <div className="grid grid-cols-4 gap-y-6 gap-x-4">
        {/* Render Apps */}
        {homeScreenApps.map((app) => (
          <button 
            key={app.id}
            onClick={() => handleOpenApp(app)}
            className="flex flex-col items-center justify-start space-y-1 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-white/20 backdrop-blur-sm">
              <img 
                src={`/images/${app.icon}`} 
                alt={app.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-xs font-medium tracking-wide drop-shadow-md truncate w-full text-center">
              {app.name}
            </span>
          </button>
        ))}

        {/* Render Projects as Folder Icons */}
        {projects.map((project: any) => (
          <button 
            key={project.id}
            onClick={() => handleOpenProject(project)}
            className="flex flex-col items-center justify-start space-y-1 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-1 bg-white/10 backdrop-blur-sm">
              <img 
                src={project.icon || "/images/folder.webp"} 
                alt={project.name} 
                className="w-[90%] h-[90%] object-contain drop-shadow-sm"
              />
            </div>
            <span className="text-white text-xs font-medium tracking-wide drop-shadow-md truncate w-full text-center">
              {project.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IosHomeScreen;
