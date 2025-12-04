import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max:400, default: 100},
  title: { min: 400, max: 900, default: 400},
}

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === "" ? "\u00A0" : char}
    </span>
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

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, 'title');
    const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');

    return () => {
      subtitleCleanup();
      titleCleanup();
    }
  }, [])

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {renderText(
          "Hey, I'm Swastik! Welcome to my",
          "text-xl sm:text-3xl font-georama text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] tracking-wide",
          100
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText(
          "portfolio",
          "text-8xl sm:text-7xl md:text-9xl italic font-georama text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] tracking-wide" 
        )}
      </h1>
      <div className="small-screen">
        <p className="text-white">Mobile version is still in progress. For the full experience, use a larger screen or visit the desktop site. </p>
        <br />
        <a href="https://swastiksharma15.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" className="flex-center text-blue-100">For Mobile Devices visit here</a>
      </div>
    </section>
  );
};

export default Welcome;
