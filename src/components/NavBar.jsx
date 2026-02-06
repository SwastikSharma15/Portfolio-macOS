import dayjs from 'dayjs'
import { navIcons, navLinks, locations } from "#constants";
import useWindowStore from '#store/window';
import useLocationStore from '#store/location';
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

const NavBar = () => {

  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();

  const wrapperRef = useRef(null);
  const gifRef = useRef(null);
  const logoPortfolioRef = useRef(null);
  const dateTimeRef = useRef(null);
  const logoPortfolioPlaceholderRef = useRef(null);
  const dateTimePlaceholderRef = useRef(null);

  useEffect(() => {
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
        zIndexBoost: false, // Prevent z-index from increasing on drag
        onDragStart: function () {
          // Show dotted placeholder
          gsap.to(logoPortfolioPlaceholder, { opacity: 1, duration: 0.2 });
        },
        onDrag: function () {
          const isWithinSnapZone = 
            Math.abs(this.x) < snapThreshold && 
            Math.abs(this.y) < snapThreshold;
        },
        onDragEnd: function () {
          const isWithinSnapZone = 
            Math.abs(this.x) < snapThreshold && 
            Math.abs(this.y) < snapThreshold;

          if (isWithinSnapZone) {
            // Snap back to original position
            gsap.to(this.target, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
          
          // Hide placeholder
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
        zIndexBoost: false, // Prevent z-index from increasing on drag
        onDragStart: function () {
          // Show dotted placeholder
          gsap.to(dateTimePlaceholder, { opacity: 1, duration: 0.2 });
        },
        onDrag: function () {
          const isWithinSnapZone = 
            Math.abs(this.x) < snapThreshold && 
            Math.abs(this.y) < snapThreshold;
        },
        onDragEnd: function () {
          const isWithinSnapZone = 
            Math.abs(this.x) < snapThreshold && 
            Math.abs(this.y) < snapThreshold;

          if (isWithinSnapZone) {
            // Snap back to original position
            gsap.to(this.target, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
          
          // Hide placeholder
          gsap.to(dateTimePlaceholder, { opacity: 0, duration: 0.2 });
        }
      });
    }

    return () => {
      wrapper.removeEventListener("mouseenter", enter);
      wrapper.removeEventListener("mouseleave", leave);
    };
  }, []);
  
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
        {/* Draggable logo + portfolio section */}
        <div className="logo-portfolio-container" ref={logoPortfolioRef}>
          <img src="/images/logo.svg" alt="logo" />
          <div className="portfolio-wrapper" ref={wrapperRef}>
            <p className="font-bold portfolio-text">Swastik's Portfolio</p>
            <div className="portfolio-text-container">
              <div className="overlay-gif" ref={gifRef}></div>
            </div>
          </div>
        </div>
        
        {/* Placeholder for logo + portfolio */}
        <div className="logo-portfolio-placeholder" ref={logoPortfolioPlaceholderRef}>
        </div>

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
        
        {/* Draggable date & time */}
        <time ref={dateTimeRef}>
          {dayjs().format('ddd, MMM D • h:mm A')}
        </time>
        
        {/* Placeholder for date & time */}
        <div className="datetime-placeholder" ref={dateTimePlaceholderRef}>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
