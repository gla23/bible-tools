import { RefObject, useEffect, useState } from "react";

/** Whether most of the element is on screen (clipping ancestors count) */
export function useInView(ref: RefObject<Element | null>, threshold = 0.6) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
