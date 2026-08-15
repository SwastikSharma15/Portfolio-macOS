import React, { useRef, useEffect, useCallback } from "react";

// Utility to match your NavBar performance strategy
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

const NavLink = React.memo(({ name, onClick }) => {
  const underlineRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    // Only load GSAP for the underline animation on desktop
    if (!isMobile) {
      import("gsap").then(({ gsap }) => {
        gsapRef.current = gsap;
      });
    }
  }, []);

  const handleDirection = useCallback((e, isEntering) => {
    // Optimization: Early exit for mobile or if GSAP hasn't loaded yet
    if (isMobile || !gsapRef.current) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const middle = left + width / 2;
    const side = e.clientX < middle ? "left" : "right";
    const gsap = gsapRef.current;

    if (isEntering) {
      gsap.set(underlineRef.current, { transformOrigin: side });
      gsap.to(underlineRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.set(underlineRef.current, { transformOrigin: side });
      gsap.to(underlineRef.current, {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, []);

  return (
    <li
      className="relative px-1 py-[1px] cursor-pointer group list-none"
      onMouseEnter={(e) => handleDirection(e, true)}
      onMouseLeave={(e) => handleDirection(e, false)}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-black/90">{name}</span>
      
      {/* The Animated Underline */}
      <span
        ref={underlineRef}
        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black scale-x-0"
      />
    </li>
  );
});

NavLink.displayName = "NavLink";

export default NavLink;