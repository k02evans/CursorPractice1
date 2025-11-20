"use client";

import { useEffect, useRef } from "react";

export function CursorLight() {
  const lightRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lightX = useRef(0);
  const lightY = useRef(0);
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const cursorLight = lightRef.current;
    if (!cursorLight) return;

    let isAnimating = true;

    const animate = () => {
      if (!isAnimating) return;

      lightX.current += (mouseX.current - lightX.current) * 0.15;
      lightY.current += (mouseY.current - lightY.current) * 0.15;

      cursorLight.style.setProperty("--light-x", `${lightX.current}px`);
      cursorLight.style.setProperty("--light-y", `${lightY.current}px`);
      cursorLight.classList.add("active");

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const updateCursorLight = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const throttledUpdate = throttle(updateCursorLight, 16);

    document.addEventListener("mousemove", throttledUpdate);

    // Initialize
    lightX.current = window.innerWidth / 2;
    lightY.current = window.innerHeight / 2;
    animate();

    return () => {
      isAnimating = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      document.removeEventListener("mousemove", throttledUpdate);
    };
  }, []);

  return <div ref={lightRef} className="cursor-light" />;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

