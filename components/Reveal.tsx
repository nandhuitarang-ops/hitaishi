"use client";

import { useEffect, useRef, useState, createElement } from "react";

type TagName = keyof HTMLElementTagNameMap;

type AnimationVariant = "fade-up" | "fade-in" | "scale-in";

interface RevealProps {
  as?: TagName;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationVariant;
  style?: React.CSSProperties;
}

const animStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
  "fade-up": { hidden: "opacity-0 translate-y-3", visible: "opacity-100 translate-y-0" },
  "fade-in": { hidden: "opacity-0", visible: "opacity-100" },
  "scale-in": { hidden: "opacity-0 scale-[0.95]", visible: "opacity-100 scale-100" },
};

export function Reveal({ as = "div", children, className = "", delay = 0, animation = "fade-up", style = {} }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const s = animStyles[animation];

  return createElement(as, {
    ref,
    className: `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className} ${isVisible ? s.visible : s.hidden}`,
    style: { ...style, transitionDelay: `${delay}ms` },
  }, children);
}
