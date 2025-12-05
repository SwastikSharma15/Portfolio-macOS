import dayjs from 'dayjs'
import { navIcons, navLinks, locations } from "#constants";
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';

const NavBar = () => {

  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();
  
  const handleNavLinkClick = (type) => {
    if (!type) return;

    // Ensure Finder opens at Work instead of Trash by default
    if (type === 'finder') {
      setActiveLocation(locations.work);
    }

    openWindow(type);
  };

  const handleIconClick = ({ type, action }) => {
    if (!type) return;
    
    openWindow(type);
    
    // If action is specified, perform it (e.g., "about" opens About me location)
    if (action === 'about') {
      setActiveLocation(locations.about);
    }
  }

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Swastik's Portfolio</p>
        <ul>
          {navLinks.map(({ name, id, type }) => (
            <li key={id} onClick={() => handleNavLinkClick(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img, type, action }) => (
            <li key={id} onClick={() => handleIconClick({ type, action })}>
              <img
                src={img}
                className={`icon-hover ${type ? 'cursor-pointer' : ''}`}
                alt={`icon-${id}`}
              />
            </li>
          ))}
        </ul>
        <time>
          {dayjs().format('ddd MMM D h:mm A')}
        </time>
      </div>
    </nav>
  );
};

export default NavBar;
