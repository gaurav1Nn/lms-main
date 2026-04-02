import { useEffect, useRef, useState } from "react";

/**
 * Shared scroll-triggered visibility hook using native IntersectionObserver.
 * Used by CoursesSection and WhyUsSection to gate entrance animations.
 *
 * @param {number} threshold - % of element visible before triggering (default 0.15)
 * @returns {[React.RefObject, boolean]} [ref to attach to section, isVisible state]
 */
const useScrollAnimation = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Fire once, then stop watching
        }
      },
      { threshold }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  return [ref, isVisible];
};

export default useScrollAnimation;
