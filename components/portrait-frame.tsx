"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const MAX_TILT = 10;
const spring = { stiffness: 150, damping: 20, mass: 0.6 };

export function PortraitFrame() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  // Pointer position relative to the portrait centre, from -0.5 to 0.5 on each axis.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);

  const rotateY = useTransform(x, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(y, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const shadowX = useTransform(x, [-0.5, 0.5], [16, -16]);
  const shadowY = useTransform(y, [-0.5, 0.5], [18, 4]);
  const glareX = useTransform(x, [-0.5, 0.5], ["-22%", "22%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["-22%", "22%"]);

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
    setActive(false);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // Touch and reduced motion keep the restrained idle state only.
    if (reduce || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.min(0.5, Math.max(-0.5, (event.clientX - rect.left) / rect.width - 0.5)));
    pointerY.set(Math.min(0.5, Math.max(-0.5, (event.clientY - rect.top) / rect.height - 0.5)));
    if (!active) setActive(true);
  };

  return (
    <div
      className="portrait-composition"
      data-active={active ? "true" : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <div className="portrait-float">
        <motion.span
          className="portrait-shadow"
          aria-hidden="true"
          style={{ x: shadowX, y: shadowY }}
        />
        <motion.div className="portrait-stage" style={{ rotateX, rotateY, transformPerspective: 900 }}>
          <div className="portrait-photo">
            <Image
              src="/images/ahmed-aziz-portrait.webp"
              alt="Portrait of Ahmed Aziz Barhoumi in an office"
              fill
              priority
              sizes="(max-width: 700px) 42vw, (max-width: 900px) 31vw, 34vw"
              className="portrait-image"
            />
            <motion.span className="portrait-glare" aria-hidden="true" style={{ x: glareX, y: glareY }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PortraitFrame;
