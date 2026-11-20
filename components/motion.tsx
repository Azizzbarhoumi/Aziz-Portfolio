"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const revealEase = [0.22, 1, 0.36, 1] as const;

/**
 * Shared entrance for content scrolling into view: a short fade and lift that runs once,
 * starts as soon as the element nears the viewport, and is skipped for reduced motion.
 */
export function getRevealProps(reduce: boolean | null, delay = 0) {
  // Server HTML is rendered with the hidden starting state, so reduced motion snaps to the
  // final state on hydration instead of skipping the animation props entirely.
  if (reduce) return { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } };
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -6% 0px" },
    transition: { duration: 0.5, delay: Math.min(delay, 0.24), ease: revealEase },
  };
}

export function useRevealProps(delay = 0) {
  return getRevealProps(useReducedMotion(), delay);
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const revealProps = useRevealProps(delay);
  return (
    <motion.div className={className} {...revealProps}>
      {children}
    </motion.div>
  );
}

export function HeroReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <span className="hero-reveal-line" style={{ animationDelay: `${delay}s` }}>{children}</span>;
}

export function MagneticLink({
  href,
  children,
  className = "",
  target,
  ...props
}: ComponentPropsWithoutRef<typeof motion.a>) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.25 });

  return (
    <motion.a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
