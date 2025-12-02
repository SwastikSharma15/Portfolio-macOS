import useWindowStore from '#store/window'
import { useGSAP } from '@gsap/react';
import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {

  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, isMaximized, zIndex } = windows[windowKey];
    const ref = useRef(null);

    // open animation
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      el.style.display = 'block';

      gsap.fromTo(el, {
        scale: 0.8,
        opacity:0, 
        y: 40,
      },{
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out'
      })
    }, [isOpen]);

    // draggable handling (disable when maximized or closed)
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      if (!isOpen || isMaximized) {
        // ensure any previous Draggable is killed
        Draggable.get(el)?.kill();
        return;
      }

      const [ instance ] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
        trigger: el.querySelector('.window-drag-handle'),
        ignore: "input[type='range'], button, .sliders"
      })

      return () => instance.kill();
    }, [isOpen, isMaximized, focusWindow]);

    useLayoutEffect(() => {
      const el = ref.current;
      if(!el) return;

      // visibility based on open state
      el.style.display = isOpen ? 'block' : 'none';

      // toggle maximized styles
      if (isMaximized) {
        // save current position/size once
        if (!el.dataset.prevTop) {
          const cs = window.getComputedStyle(el);
          el.dataset.prevTop = cs.top;
          el.dataset.prevLeft = cs.left;
          el.dataset.prevWidth = cs.width;
          el.dataset.prevHeight = cs.height;
          el.dataset.prevPosition = cs.position;
          el.dataset.prevTransform = cs.transform;
          el.dataset.prevMaxWidth = cs.maxWidth;
          el.dataset.prevRight = cs.right;
          el.dataset.prevBottom = cs.bottom;
        }
        // make it independent from parent constraints
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.right = '0';
        el.style.bottom = '0';
        // ensure it can span full viewport
        el.style.width = '100dvw';
        el.style.height = '100dvh';
        el.style.maxWidth = 'none';
        // neutralize any translate from CSS (e.g., -translate-y-1/2)
        el.style.transform = 'none';
      } else {
        // restore to previous size/position if saved
        if (el.dataset.prevTop) {
          // restore primary box metrics
          el.style.top = el.dataset.prevTop;
          el.style.left = el.dataset.prevLeft;
          el.style.width = el.dataset.prevWidth;
          el.style.height = el.dataset.prevHeight;
          // restore position and optional constraints
          if (el.dataset.prevPosition) el.style.position = el.dataset.prevPosition;
          if (el.dataset.prevMaxWidth) el.style.maxWidth = el.dataset.prevMaxWidth;
          if (el.dataset.prevTransform) el.style.transform = el.dataset.prevTransform;
          // clear edges that were set for maximized
          el.style.right = '';
          el.style.bottom = '';
          // cleanup
          delete el.dataset.prevTop;
          delete el.dataset.prevLeft;
          delete el.dataset.prevWidth;
          delete el.dataset.prevHeight;
          delete el.dataset.prevPosition;
          delete el.dataset.prevTransform;
          delete el.dataset.prevMaxWidth;
          delete el.dataset.prevRight;
          delete el.dataset.prevBottom;
        } else {
          // reset to auto so component/style sheets can manage sizing/positioning
          el.style.right = '';
          el.style.bottom = '';
          el.style.width = '';
          el.style.height = '';
          el.style.maxWidth = '';
          el.style.transform = '';
        }
        // keep previously dragged top/left as set by Draggable (restored above if existed)
      }
    }, [isOpen, isMaximized]);


    return (
      <section 
        id={windowKey} 
        ref={ref} 
        style={{zIndex}} 
        className='absolute window-root'>
          <Component {...props} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(
    ${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
}

export default WindowWrapper