'use client';

/**
 * Function to reveal elements when they enter the viewport
 * This is NOT a React hook and should be called within useEffect
 * 
 * @param element HTML element to observe
 * @param options Configuration options
 * @returns A cleanup function to disconnect the observer
 */
const setupScrollReveal = (
  element: HTMLElement,
  options: {
    threshold?: number;
    rootMargin?: string;
    animationClass?: string;
    delay?: number;
    once?: boolean;
  } = {}
): (() => void) => {
  if (!element) return () => {};
  
  // Default options
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px', // Triggers slightly before element enters viewport
    animationClass = 'animate-reveal-up',
    delay = 0,
    once = true
  } = options;
  
  // Add required classes for animation
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  element.style.transitionDelay = `${delay}ms`;
  element.style.transform = 'translateY(20px)';
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Wait a frame to ensure CSS transitions work properly
          requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add(animationClass);
          });
          
          if (once) observer.disconnect();
        } else if (!once) {
          // Reset if not in viewport and not a one-time animation
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
          element.classList.remove(animationClass);
        }
      });
    },
    { threshold, rootMargin }
  );
  
  observer.observe(element);
  
  return () => {
    observer.disconnect();
  };
};

export default setupScrollReveal;
