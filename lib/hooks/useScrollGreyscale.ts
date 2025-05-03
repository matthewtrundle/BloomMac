'use client';

/**
 * A function that applies a grayscale filter to elements when they enter or exit the viewport.
 * This is NOT a React hook and should be called within useEffect
 * 
 * @param element - The HTML element to observe
 * @param options - Options for configuring the intersection observer
 * @returns A cleanup function to disconnect the observer
 */
const setupScrollGreyscale = (
  element: HTMLElement,
  options: {
    threshold?: number;
    rootMargin?: string;
    grayscaleOnEnter?: boolean; // If true, element becomes grayscale when entering viewport
    transitionDuration?: string;
  } = {}
): (() => void) => {
  if (!element) return () => {};
  
  // Default options
  const {
    threshold = 0.2,
    rootMargin = '0px',
    grayscaleOnEnter = false, // By default, element becomes colored when entering viewport
    transitionDuration = '700ms'
  } = options;
  
  // Add transition class
  element.style.transition = `filter ${transitionDuration} ease-in-out`;
  
  // Set initial state
  if (grayscaleOnEnter) {
    element.style.filter = 'grayscale(0)';
  } else {
    element.style.filter = 'grayscale(1)';
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (grayscaleOnEnter) {
          // Apply grayscale when entering
          element.style.filter = entry.isIntersecting
            ? 'grayscale(1)'
            : 'grayscale(0)';
        } else {
          // Remove grayscale when entering
          element.style.filter = entry.isIntersecting
            ? 'grayscale(0)'
            : 'grayscale(1)';
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

export default setupScrollGreyscale;
