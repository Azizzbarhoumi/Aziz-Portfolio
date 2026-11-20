"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps, type Variants } from "framer-motion";

export const revealEase = [0.22, 1, 0.36, 1] as const;

/** Viewport trigger shared by every reveal: starts as soon as the element is a little way into view. */
export const revealViewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Item entrance used inside a RevealGroup: rises 44px out of a bottom-up wipe. The clip is removed
 * once finished so focus outlines and hover states are never cut off.
 */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 44, clipPath: "inset(0% 0% 100% 0%)" },
  shown: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.85, ease: revealEase, delay, delayChildren: delay + 0.3, staggerChildren: 0.03 },
    transitionEnd: { clipPath: "none" },
  }),
  still: { opacity: 1, y: 0, clipPath: "none", transition: { duration: 0 } },
};

/** Lines of large type rise out of a mask, matching the hero headline. */
export const maskLine: Variants = {
  hidden: { y: "108%" },
  shown: { y: "0%", transition: { duration: 0.95, ease: revealEase } },
  still: { y: "0%", transition: { duration: 0 } },
};

/** Small elements inside a revealed item (skill tags, timeline dots) follow it in sequence. */
export const chipIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: revealEase } },
  still: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export const dotIn: Variants = {
  hidden: { scale: 0 },
  shown: { scale: 1, transition: { duration: 0.5, ease: revealEase, delay: 0.25 } },
  still: { scale: 1, transition: { duration: 0 } },
};

/** Education rows sweep in from the right edge. */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 140 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.9, ease: revealEase, delayChildren: 0.3 } },
  still: { opacity: 1, x: 0, transition: { duration: 0 } },
};

/** Certification lines flip up into place like cards. */
export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: -80, y: 18 },
  shown: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.7, ease: revealEase } },
  still: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0 } },
};

/** Section rules draw in from the left. */
export const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: revealEase } },
  still: { scaleX: 1, transition: { duration: 0 } },
};

/** Heading arrows turn into place. */
export const arrowTurn: Variants = {
  hidden: { opacity: 0, rotate: -90, scale: 0.6 },
  shown: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.8, ease: revealEase } },
  still: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0 } },
};

/**
 * Props for a container whose children (using revealItem / maskLine variants) enter one after another.
 * With reduced motion everything is set straight to its final state.
 */
export function useGroupReveal(stagger = 0.09, delay = 0): Pick<
  HTMLMotionProps<"div">,
  "initial" | "animate" | "whileInView" | "viewport" | "variants"
> {
  const reduce = useReducedMotion();
  if (reduce) return { initial: "hidden", animate: "still", variants: { hidden: {}, still: {} } };
  return {
    initial: "hidden",
    whileInView: "shown",
    viewport: revealViewport,
    variants: { hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } },
  };
}

/** Standalone reveal with its own viewport trigger; the element itself animates, so grid classes still apply. */
export function Reveal({ children, delay = 0, className = "", id }: { children: ReactNode; delay?: number; className?: string; id?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      id={id}
      className={className}
      data-reveal
      variants={revealItem}
      custom={delay}
      initial="hidden"
      {...(reduce ? { animate: "still" } : { whileInView: "shown", viewport: revealViewport })}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its RevealItem children. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const group = useGroupReveal(stagger, delay);
  return (
    <motion.div className={className} {...group}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", variants = revealItem }: { children: ReactNode; className?: string; variants?: Variants }) {
  return (
    <motion.div className={className} data-reveal variants={variants}>
      {children}
    </motion.div>
  );
}

/** Splits text on line breaks and raises each line out of its own mask. */
export function MaskLines({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <span className={`mask-line ${className}`} key={index}>
          <motion.span className="mask-line-inner" data-reveal variants={maskLine}>
            {line}
          </motion.span>
        </span>
      ))}
    </>
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
