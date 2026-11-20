"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { revealEase } from "@/components/motion";

/**
 * True only in the browser when the media query matches and the visitor has not asked for reduced
 * motion. The server and the first client render always get false, so the page is first drawn in its
 * final, fully visible state and scroll scenes switch on after hydration.
 */
export function useScrollScene(query = "(min-width: 0px)") {
  const full = `${query} and (prefers-reduced-motion: no-preference)`;
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(full);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(full).matches,
    () => false,
  );
}

/** Desktop scenes need room: a wide viewport that is also tall enough for a pinned stage. */
export const pinQuery = "(min-width: 1024px) and (min-height: 680px)";

/* ------------------------------------------------------------------------------------------------ */
/* Page progress bar and chapter rail                                                               */
/* ------------------------------------------------------------------------------------------------ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const on = useScrollScene();
  if (!on) return null;
  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: scrollYProgress }} />;
}

export function ChapterRail({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const on = useScrollScene("(min-width: 1100px)");

  useEffect(() => {
    if (!on) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters, on]);

  if (!on) return null;
  return (
    <nav className="chapter-rail" aria-label="Page sections">
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a href={`#${chapter.id}`} aria-current={active === chapter.id ? "true" : undefined}>
              <span className="chapter-rail-label">{chapter.label}</span>
              <span className="chapter-rail-index">{String(index).padStart(2, "0")}</span>
              <span className="chapter-rail-tick" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Hero: pinned while the next panels slide over it                                                  */
/* ------------------------------------------------------------------------------------------------ */

export function useHeroRecede(hero: RefObject<HTMLElement | null>) {
  const on = useScrollScene();
  const { scrollY } = useScroll();
  const [height, setHeight] = useState(860);

  useEffect(() => {
    const measure = () => setHeight(hero.current?.offsetHeight || 860);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [hero]);

  const end = Math.max(height, 400);
  const scale = useTransform(scrollY, [0, end], on ? [1, 0.84] : [1, 1]);
  const y = useTransform(scrollY, [0, end], on ? [0, -50] : [0, 0]);
  const opacity = useTransform(scrollY, [0, end * 0.9], on ? [1, 0.15] : [1, 1]);
  const dim = useTransform(scrollY, [0, end], on ? [0, 0.75] : [0, 0]);
  return { grid: { scale, y, opacity }, dim };
}

/* ------------------------------------------------------------------------------------------------ */
/* Stats: numbers count up once                                                                      */
/* ------------------------------------------------------------------------------------------------ */

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useScrollScene();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const counts = match !== null;
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!on || !counts) return;
    if (!inView) {
      setShown(0);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setShown(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, on, target, counts]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{shown === null ? target : shown}{suffix}</span>
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* About: the statement lights up word by word as it scrolls through the viewport                  */
/* ------------------------------------------------------------------------------------------------ */

export type Segment = { text: string; strong?: boolean };

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: ReactNode }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span className="scroll-word" style={{ opacity }}>{children}</motion.span>;
}

export function ScrollWords({ segments }: { segments: Segment[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const on = useScrollScene();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.5"] });

  if (!on) {
    return (
      <p ref={ref}>
        {segments.map((segment, index) => (segment.strong ? <strong key={index}>{segment.text}</strong> : <span key={index}>{segment.text}</span>))}
      </p>
    );
  }

  const words = segments.flatMap((segment) =>
    segment.text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((text) => ({ text, strong: segment.strong })),
  );
  const total = words.filter((word) => word.text.trim()).length;
  let count = 0;

  return (
    <p ref={ref} className="scroll-words">
      {words.map((word, index) => {
        if (!word.text.trim()) return word.text;
        const start = count / total;
        count += 1;
        const range: [number, number] = [start * 0.9, Math.min(1, start * 0.9 + 0.12)];
        return (
          <Word key={index} progress={scrollYProgress} range={range}>
            {word.strong ? <strong>{word.text}</strong> : word.text}
          </Word>
        );
      })}
    </p>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Skills: a short pinned scene that steps through the groups                                        */
/* ------------------------------------------------------------------------------------------------ */

type SkillGroup = { title: string; items: string[] };

export function SkillsScene({ groups, heading }: { groups: SkillGroup[]; heading: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(groups.length - 1, Math.max(0, Math.floor(latest * groups.length)));
    setActive((current) => (current === next ? current : next));
  });

  const group = groups[active];

  return (
    <div className="skills-track" ref={track} style={{ height: `calc(100svh + ${groups.length * 48}vh)` }}>
      <div className="skills-pin">
        <div className="section-shell">
          {heading}
          <ul className="sr-only">
            {groups.map((item) => (
              <li key={item.title}>
                {item.title}: {item.items.join(", ")}
              </li>
            ))}
          </ul>
          <div className="skills-scene" aria-hidden="true">
            <ol className="skills-scene-list">
              {groups.map((item, index) => (
                <li key={item.title} data-active={index === active ? "true" : undefined}>
                  <span>0{index + 1}</span>
                  {item.title}
                </li>
              ))}
            </ol>
            <div className="skills-scene-stage">
              <div className="skills-scene-count">
                <b>0{active + 1}</b> / 0{groups.length}
                <span className="skills-scene-bar"><motion.i style={{ scaleX: fill }} /></span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={group.title}
                  className="skills-scene-group"
                  initial="hidden"
                  animate="shown"
                  exit="gone"
                  variants={{
                    hidden: {},
                    shown: { transition: { staggerChildren: 0.035 } },
                    gone: { opacity: 0, y: -24, transition: { duration: 0.22 } },
                  }}
                >
                  <span className="mask-line">
                    <motion.span
                      className="mask-line-inner skills-scene-title"
                      variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 0.6, ease: revealEase } } }}
                    >
                      {group.title}
                    </motion.span>
                  </span>
                  <div className="skills-scene-chips">
                    {group.items.map((item) => (
                      <motion.span
                        key={item}
                        variants={{
                          hidden: { opacity: 0, y: 22, scale: 0.92 },
                          shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: revealEase } },
                        }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Experience: a line draws down the timeline and lights each entry it reaches                      */
/* ------------------------------------------------------------------------------------------------ */

export function TimelineTrace({ target }: { target: RefObject<HTMLElement | null> }) {
  const on = useScrollScene();
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.62", "end 0.62"] });

  useEffect(() => {
    const root = target.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-trace]"));
    if (!on) {
      rows.forEach((row) => delete row.dataset.lit);
      root.removeAttribute("data-tracing");
      return;
    }
    root.setAttribute("data-tracing", "true");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const row = entry.target as HTMLElement;
          // Lit once its top passes the trace point; unlit again only when scrolled back above it.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) row.dataset.lit = "true";
          else delete row.dataset.lit;
        });
      },
      { rootMargin: "0px 0px -38% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [on, target]);

  if (!on) return null;
  return (
    <span className="timeline-trace" aria-hidden="true">
      <motion.i style={{ scaleY: scrollYProgress }} />
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Contact: title lines slide in from opposite sides as the panel arrives                           */
/* ------------------------------------------------------------------------------------------------ */

export function useConverge(target: RefObject<HTMLElement | null>) {
  const on = useScrollScene();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 0.25"] });
  const left = useTransform(scrollYProgress, [0, 1], on ? ["-22vw", "0vw"] : ["0vw", "0vw"]);
  const right = useTransform(scrollYProgress, [0, 1], on ? ["22vw", "0vw"] : ["0vw", "0vw"]);
  return { left, right };
}
