import { navIcons, navLinks, locations } from "#constants";
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { useEffect, useRef, useCallback } from "react";
import React from "react";

// Only import heavy dependencies on desktop
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

const NavBar = React.memo(() => {

  const openWindow = useWindowStore(state => state.openWindow);
  const setActiveLocation = useLocationStore(state => state.setActiveLocation);

  const wrapperRef = useRef(null);
  const gifRef = useRef(null);
  const logoPortfolioRef = useRef(null);
  const dateTimeRef = useRef(null);
  const logoPortfolioPlaceholderRef = useRef(null);
  const dateTimePlaceholderRef = useRef(null);

  useEffect(() => {
    // Skip animations on mobile for better performance
    if (isMobile) return;
    
    // Dynamically import GSAP only on desktop
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      const wrapper = wrapperRef.current;
      const gif = gifRef.current;
      const logoPortfolio = logoPortfolioRef.current;
      const dateTime = dateTimeRef.current;
      const logoPortfolioPlaceholder = logoPortfolioPlaceholderRef.current;
      const dateTimePlaceholder = dateTimePlaceholderRef.current;

      if (!wrapper || !gif) return;

      // Initial state (hidden + down)
      gsap.set(gif, {
        opacity: 0,
        y: 8
      });

      // Hide placeholders initially
      if (logoPortfolioPlaceholder) {
        gsap.set(logoPortfolioPlaceholder, { opacity: 0 });
      }
      if (dateTimePlaceholder) {
        gsap.set(dateTimePlaceholder, { opacity: 0 });
      }

      const enter = () => {
        gsap.to(gif, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out"
        });
      };

      const leave = () => {
        gsap.to(gif, {
          opacity: 0,
          y: 8,
          duration: 0.3,
          ease: "power3.out"
        });
      };

      wrapper.addEventListener("mouseenter", enter);
      wrapper.addEventListener("mouseleave", leave);

      // Implement drag functionality for logo + portfolio text
      if (logoPortfolio && logoPortfolioPlaceholder) {
        const snapThreshold = 500;

        Draggable.create(logoPortfolio, {
          type: "x,y",
          bounds: "body",
          cursor: "grab",
          activeCursor: "grabbing",
          zIndexBoost: false,
          onDragStart: function () {
            gsap.to(logoPortfolioPlaceholder, { opacity: 1, duration: 0.2 });
          },
          onDragEnd: function () {
            const isWithinSnapZone = 
              Math.abs(this.x) < snapThreshold && 
              Math.abs(this.y) < snapThreshold;

            if (isWithinSnapZone) {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
            
            gsap.to(logoPortfolioPlaceholder, { opacity: 0, duration: 0.2 });
          }
        });
      }

      // Implement drag functionality for date & time
      if (dateTime && dateTimePlaceholder) {
        const snapThreshold = 500;

        Draggable.create(dateTime, {
          type: "x,y",
          bounds: "body",
          cursor: "grab",
          activeCursor: "grabbing",
          zIndexBoost: false,
          onDragStart: function () {
            gsap.to(dateTimePlaceholder, { opacity: 1, duration: 0.2 });
          },
          onDragEnd: function () {
            const isWithinSnapZone = 
              Math.abs(this.x) < snapThreshold && 
              Math.abs(this.y) < snapThreshold;

            if (isWithinSnapZone) {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
            
            gsap.to(dateTimePlaceholder, { opacity: 0, duration: 0.2 });
          }
        });
      }
    });
  }, []);
  
  const handleNavLinkClick = useCallback((type) => {
    if (!type) return;

    if (type === 'finder') {
      setActiveLocation(locations.work);
    }

    openWindow(type);
  }, [openWindow, setActiveLocation]);

  const handleIconClick = useCallback(({ type, action }) => {
    if (!type) return;
    
    openWindow(type);
    
    if (action === 'about') {
      setActiveLocation(locations.about);
    }
  }, [openWindow, setActiveLocation]);

  // Simple time display for mobile (no dayjs)
  const getTimeString = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} • ${hours}:${minutes} ${ampm}`;
  };

  return (
    <nav>
      <div>
        {/* Draggable logo + portfolio section */}
        <div className="logo-portfolio-container" ref={logoPortfolioRef}>
          <img src="/images/logo.svg" alt="logo" />
          <div className="portfolio-wrapper" ref={wrapperRef}>
            <p className="font-bold portfolio-text">Swastik's Portfolio</p>
            {!isMobile && (
              <div className="portfolio-text-container">
                <div className="overlay-gif" ref={gifRef}></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Placeholder for logo + portfolio */}
        {!isMobile && (
          <div className="logo-portfolio-placeholder" ref={logoPortfolioPlaceholderRef}>
          </div>
        )}

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
        
        {/* Date & time */}
        <time ref={dateTimeRef}>
          {getTimeString()}
        </time>
        
        {/* Placeholder for date & time */}
        {!isMobile && (
          <div className="datetime-placeholder" ref={dateTimePlaceholderRef}>
          </div>
        )}
      </div>
    </nav>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
