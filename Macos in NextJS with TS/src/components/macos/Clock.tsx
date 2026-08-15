import React, { useState, useEffect, useRef } from 'react';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

const Clock = React.memo(() => {
  const [time, setTime] = useState(() => getTimeString());
  const dateTimeRef = useRef(null);
  const dateTimePlaceholderRef = useRef(null);

  function getTimeString() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} • ${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    // Update time every 60 seconds
    const intervalId = setInterval(() => {
      setTime(getTimeString());
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Skip drag functionality on mobile
    if (isMobile) return;

    // Dynamically import GSAP only on desktop
    Promise.all([
      import('gsap'),
      import('gsap/Draggable')
    ]).then(([{ gsap }, { Draggable }]) => {
      const dateTime = dateTimeRef.current;
      const dateTimePlaceholder = dateTimePlaceholderRef.current;

      if (!dateTime || !dateTimePlaceholder) return;

      // Hide placeholder initially
      gsap.set(dateTimePlaceholder, { opacity: 0 });

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
    });
  }, []);

  return (
    <>
      <time ref={dateTimeRef}>
        {time}
      </time>
      
      {/* Placeholder for date & time */}
      {!isMobile && (
        <div className="datetime-placeholder" ref={dateTimePlaceholderRef}>
        </div>
      )}
    </>
  );
});

Clock.displayName = 'Clock';

export default Clock;
