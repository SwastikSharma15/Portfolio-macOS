import dayjs from 'dayjs'
import { navIcons, navLinks } from "#constants";
import useWindowStore from '#store/window';

const NavBar = () => {

  const { openWindow } = useWindowStore();
  
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Swastik's Portfolio</p>
        <ul>
          {navLinks.map(({ name, id, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img
                src={img}
                className="icon-hover cursor-pointer"
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
