"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useScrollScene } from "@/components/scroll-scenes";

const MAX_TILT_Y = 10;
const MAX_TILT_X = 8;
const spring = { stiffness: 120, damping: 20, mass: 0.7 };

/**
 * Hero portrait: the real photo, unaltered, with feathered edges instead of a frame. Depth comes from
 * layers around it (ring and glow behind, contact shadow below, a soft light that follows the pointer)
 * plus a restrained perspective tilt driven by the pointer anywhere on the page. As the hero scrolls
 * away the portrait leans back and drifts up. Touch screens get a static photo with a slow float;
 * reduced motion gets a fully still photo.
 */
export function PortraitFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useScrollScene();
  const tilts = useScrollScene("(hover: hover) and (pointer: fine)");
  const [active, setActive] = useState(false);

  // Pointer position relative to the portrait centre, -1 to 1 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);

  useEffect(() => {
    if (!tilts) {
      pointerX.set(0);
      pointerY.set(0);
      return;
    }
    let idle: ReturnType<typeof setTimeout> | undefined;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom < 0) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pointerX.set(Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2))));
      pointerY.set(Math.max(-1, Math.min(1, (event.clientY - cy) / (window.innerHeight / 2))));
      setActive(true);
      clearTimeout(idle);
      idle = setTimeout(() => setActive(false), 2400);
    };
    const leave = () => {
      pointerX.set(0);
      pointerY.set(0);
      setActive(false);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [tilts, pointerX, pointerY]);

  // Pointer-driven depth.
  const rotateY = useTransform(x, [-1, 1], [-MAX_TILT_Y, MAX_TILT_Y]);
  const pointerTiltX = useTransform(y, [-1, 1], [MAX_TILT_X, -MAX_TILT_X]);
  const shiftX = useTransform(x, [-1, 1], [-18, 18]);
  const haloX = useTransform(x, [-1, 1], [26, -26]);
  const haloY = useTransform(y, [-1, 1], [18, -18]);
  const shadowX = useTransform(x, [-1, 1], [34, -34]);
  const lightX = useTransform(x, [-1, 1], [22, 78]);
  const lightY = useTransform(y, [-1, 1], [18, 62]);
  const light = useMotionTemplate`radial-gradient(40% 34% at ${lightX}% ${lightY}%, rgba(255, 246, 236, 0.75), transparent 70%)`;

  // Scroll-driven exit: leans back, drifts up, the ring opens out.
  const { scrollY } = useScroll();
  const scrollTilt = useTransform(scrollY, [0, 700], animated ? [0, 7] : [0, 0]);
  const rotateX = useTransform(() => pointerTiltX.get() + scrollTilt.get());
  const lift = useTransform(scrollY, [0, 700], animated ? [0, -46] : [0, 0]);
  const haloScale = useTransform(scrollY, [0, 700], animated ? [1, 1.22] : [1, 1]);
  const haloOpacity = useTransform(scrollY, [0, 600], animated ? [1, 0.2] : [1, 1]);

  return (
    <div
      ref={ref}
      className={`portrait-composition ${animated ? "is-animated" : ""}`}
      data-active={active ? "true" : undefined}
    >
      <motion.div className="portrait-halo" aria-hidden="true" style={{ x: haloX, y: haloY, scale: haloScale, opacity: haloOpacity }}>
        <span className="portrait-halo-glow" />
        <span className="portrait-halo-ring" />
        <span className="portrait-halo-ring portrait-halo-ring-outer" />
      </motion.div>
      <motion.span className="portrait-shadow" aria-hidden="true" style={{ x: shadowX }} />
      <motion.div className="portrait-lift" style={{ y: lift }}>
        <div className="portrait-float">
          <motion.div className="portrait-stage" style={{ rotateX, rotateY, x: shiftX, transformPerspective: 1100 }}>
            <div className="portrait-photo">
              <Image
                src="/images/ahmed-aziz-portrait.webp"
                alt="Portrait of Ahmed Aziz Barhoumi in an office"
                fill
                priority
                sizes="(max-width: 700px) 42vw, (max-width: 900px) 31vw, 34vw"
                className="portrait-image"
              />
              <motion.span className="portrait-light" aria-hidden="true" style={{ backgroundImage: light }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default PortraitFrame;
