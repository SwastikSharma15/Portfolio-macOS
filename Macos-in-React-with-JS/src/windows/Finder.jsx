import { WindowControls } from "#components";
import { locations } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import clsx from "clsx";
import { Search } from "lucide-react/dist/esm/icons";
import React from "react";

const Finder = () => {

  const { openWindow, focusWindow } = useWindowStore();

  const { activeLocation, setActiveLocation } = useLocationStore();

  const openItem = (item) => {
    if(item.fileType === 'pdf') return openWindow('resume');
    if(item.fileType === 'txt') return openWindow('txtfile', item);
    if(item.fileType === 'img') return openWindow('imgfile', item);
    if(item.kind === 'folder') return setActiveLocation(item);
    if(['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, 'blank');

    openWindow(`${item.fileType} ${item.kind}`, item)
  };

  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx(
              item.id === activeLocation.id ? "active" : "not-active"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveLocation(item);
              focusWindow('finder');
            }}
          >
            <img src={item.icon} className="w-4" alt={item.name} loading='lazy' />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div id="window-header" className="window-drag-handle">
        <WindowControls target="finder" />
        <h2 className="font-bold">
          Swastik's Portfolio
        </h2>
        <Search className="icon" />
      </div>
      <div className="flex bg-white h-full">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("My Projects", locations.work.children)}
        </div>
        <ul className="content">
          {activeLocation.children.map((item) => (
            <li
              key={item.id}
              className={item.position}
              onClick={(e) => {
                e.stopPropagation();
                openItem(item);
              }}
            >
              <img src={item.icon} alt={item.name} loading='lazy' />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
