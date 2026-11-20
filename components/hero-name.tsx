"use client";

import { useEffect, useState } from "react";
import { useScrollScene } from "@/components/scroll-scenes";

const NAME = "AHMED AZIZ BARHOUMI";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#";

/**
 * The name decodes letter by letter on load: each character cycles through random glyphs before
 * locking in, left to right, in a monospaced face so nothing shifts. Screen readers get the plain
 * name. Without JavaScript or with reduced motion the name is simply shown.
 */
export function HeroName() {
  const animated = useScrollScene();
  const [shown, setShown] = useState(NAME);
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (!animated) return;
    setDone(false);
    const start = performance.now();
    const perChar = 42;
    const settleAfter = 260;
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      let next = "";
      let settled = 0;
      for (let i = 0; i < NAME.length; i += 1) {
        const char = NAME[i];
        if (char === " " || elapsed > settleAfter + i * perChar) {
          next += char;
          settled += 1;
        } else if (elapsed < i * perChar * 0.5) {
          next += " ";
        } else {
          next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setShown(next);
      if (settled < NAME.length) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  return (
    <p className={`hero-name ${animated ? "is-animated" : ""} ${done ? "is-done" : ""}`}>
      <span className="sr-only">Ahmed Aziz Barhoumi</span>
      <span className="hero-name-text" aria-hidden="true">
        {shown.split("").map((char, index) => (
          <span key={index} className={char === NAME[index] ? "is-locked" : undefined}>{char}</span>
        ))}
      </span>
      <span className="hero-name-caret" aria-hidden="true" />
      <span className="hero-name-rule" aria-hidden="true" />
    </p>
  );
}
