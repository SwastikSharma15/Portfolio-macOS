import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max:400, default: 100},
  title: { min: 400, max: 900, default: 400},
}

// Memoized character span component
const CharSpan = React.memo(({ char, className, baseWeight }) => (
  <span
    className={className}
    style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
  >
    {char === "" ? "\u00A0" : char}
  </span>
));

CharSpan.displayName = 'CharSpan';

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <CharSpan
      key={i}
      char={char}
      className={className}
      baseWeight={baseWeight}
    />
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = container.querySelectorAll("span");

  const { min, max, default: base} = FONT_WEIGHTS[type];

  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: 'power2.out',
      fontVariationSettings: `'wght' ${weight}`,
    })
  };

  const handleMouseMove = (e) => {
    const {left} = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w} = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2)/ 20000);

      animateLetter(letter, min + (max-min) * intensity); 
    })
  }

  const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3))

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  }
}

const Welcome = React.memo(() => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const welcomeContainerRef = useRef(null);
  const welcomePlaceholderRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, 'title');
    const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');

    // Implement drag functionality with screen-wide snap threshold (desktop only)
    const welcomeContainer = welcomeContainerRef.current;
    const welcomePlaceholder = welcomePlaceholderRef.current;

    if (welcomeContainer && welcomePlaceholder && window.innerWidth > 640) {
      // Hide placeholder initially
      gsap.set(welcomePlaceholder, { opacity: 0 });

      // Get screen dimensions for snap threshold
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const snapThreshold = Math.max(screenWidth, screenHeight); // Entire screen

      Draggable.create(welcomeContainer, {
        type: "x,y",
        bounds: "body",
        cursor: "grab",
        activeCursor: "grabbing",
        zIndexBoost: false, // Prevent z-index from increasing on drag
        onDragStart: function () {
          // Show dotted placeholder
          gsap.to(welcomePlaceholder, { opacity: 1, duration: 0.2 });
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
          gsap.to(welcomePlaceholder, { opacity: 0, duration: 0.2 });
        }
      });
    }

    return () => {
      subtitleCleanup();
      titleCleanup();
    }
  }, [])

  return (
    <>
      <section id="welcome" ref={welcomeContainerRef}>
        <p ref={subtitleRef}>
          {renderText(
            "Hey, I'm Swastik! Welcome to my",
            "text-xl sm:text-3xl font-georama text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-wide",
            100
          )}
        </p>
        <h1 ref={titleRef} className="mt-7">
          {renderText(
            "portfolio",
            "text-8xl sm:text-7xl md:text-9xl italic font-georama text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-wide" 
          )}
        </h1>
        <div className="small-screen">
          <p className="text-white">Mobile version is still in progress. For the full experience, use a larger screen or visit the desktop site. </p>
          <br />
          <a href="https://swastiksharma15.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" className="flex-center text-blue-100">For Mobile Devices visit here</a>
        </div>
      </section>
      
      {/* Placeholder for welcome text */}
      <div className="welcome-placeholder" ref={welcomePlaceholderRef}></div>
    </>
  );
});

Welcome.displayName = 'Welcome';

export default Welcome;
