"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { getLocalizedProject, type Project } from "@/data/projects";
import { maskLine, revealEase } from "@/components/motion";
import { pinQuery, useScrollScene } from "@/components/scroll-scenes";
import { useI18n } from "@/lib/i18n";

/**
 * Scroll-led project showcase. On wide, tall screens each project is a chapter with a pinned stage:
 * its visual opens as the chapter arrives, then plays a short scroll-driven scene while the details
 * reveal in sequence. Elsewhere (phones, reduced motion, before hydration) every project is a plain
 * stacked card with its visual shown in its final state.
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const pinned = useScrollScene(pinQuery);
  const animated = useScrollScene();
  return (
    <div className={`showcase ${pinned ? "is-pinned" : "is-stacked"}`}>
      {projects.map((project, index) => (
        <ProjectChapter
          key={project.slug}
          project={project}
          index={index}
          total={projects.length}
          pinned={pinned}
          animated={animated}
        />
      ))}
    </div>
  );
}

function ProjectChapter({
  project: rawProject,
  index,
  total,
  pinned,
  animated,
}: {
  project: Project;
  index: number;
  total: number;
  pinned: boolean;
  animated: boolean;
}) {
  const { lang, t } = useI18n();
  const project = getLocalizedProject(rawProject, lang);
  const ref = useRef<HTMLElement>(null);
  const flip = index % 2 === 1;

  // 0 when the chapter's top meets the bottom of the viewport, 1 when its pinned stretch ends.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const settled = useMotionValue(1);
  const progress = pinned ? scrollYProgress : settled;

  // The visual opens from an inset, rounded window into the full frame as the chapter arrives.
  const inset = useTransform(scrollYProgress, [0.12, 0.6], pinned ? [16, 0] : [0, 0]);
  const radius = useTransform(scrollYProgress, [0.12, 0.6], pinned ? [32, 3] : [3, 3]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const visualY = useTransform(scrollYProgress, [0.12, 0.6], pinned ? [90, 0] : [0, 0]);
  const numberX = useTransform(scrollYProgress, [0.2, 1], pinned ? (flip ? ["-12%", "6%"] : ["12%", "-6%"]) : ["0%", "0%"]);
  const stageScale = useTransform(leave, [0, 0.7], pinned ? [1, 0.93] : [1, 1]);
  const stageOpacity = useTransform(leave, [0, 0.7], pinned ? [1, 0.25] : [1, 1]);

  const reveal = animated
    ? { initial: "hidden" as const, whileInView: "shown" as const, viewport: { once: true, amount: pinned ? 0.6 : 0.25 } }
    : { initial: "shown" as const, animate: "shown" as const };
  const item = {
    hidden: { opacity: 0, y: 28 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
  };
  const titleLines = project.title.split(/\s(?=\()/);

  return (
    <article
      ref={ref}
      className={`showcase-chapter scene-${project.slug} ${flip ? "is-flipped" : ""}`}
      aria-labelledby={`project-${project.slug}-title`}
    >
      <motion.div className="showcase-stage" style={{ scale: stageScale, opacity: stageOpacity }}>
        <motion.span className="showcase-number" aria-hidden="true" style={{ x: numberX }}>
          {project.number}
        </motion.span>
        <motion.div className="showcase-visual" style={{ clipPath: clip, y: visualY }}>
          <ProjectScene project={project} progress={progress} />
        </motion.div>
        <motion.div
          key={animated ? "animated" : "static"}
          className="showcase-copy"
          {...reveal}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.p className="showcase-label" variants={item}>
            <b>{project.number}</b> / {String(total).padStart(2, "0")} · {project.category} · {project.year}
          </motion.p>
          <h3 id={`project-${project.slug}-title`} className="showcase-title">
            {titleLines.map((line) => (
              <span className="mask-line" key={line}>
                <motion.span className="mask-line-inner" variants={maskLine}>{line}</motion.span>
              </span>
            ))}
          </h3>
          <motion.p className="showcase-subtitle" variants={item}>{project.subtitle}</motion.p>
          <motion.p className="showcase-summary" variants={item}>{project.summary}</motion.p>
          <motion.p className="showcase-result" variants={item}>{project.result}</motion.p>
          <motion.ul className="showcase-tags" variants={item} aria-label="Technologies">
            {project.technologies.map((tech) => <li key={tech}>{tech}</li>)}
          </motion.ul>
          <motion.div variants={item}>
            <Link className="showcase-cta" href={`/projects/${project.slug}`}>
              {t("projects.viewCase")}
              <span className="sr-only">: {project.title}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
        <p className="showcase-counter" aria-hidden="true">
          <span>{project.number}</span> / {String(total).padStart(2, "0")}
          <i>{t("projects.eyebrow")}</i>
        </p>
      </motion.div>
    </article>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* One scene per project. Each takes the chapter progress (always 1 when nothing animates).          */
/* ------------------------------------------------------------------------------------------------ */

function ProjectScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  switch (project.slug) {
    case "agriconnect":
      return <AgriScene project={project} progress={progress} />;
    case "neurolearn-ai":
      return <ZoomScene project={project} progress={progress} />;
    case "city-brain-convergence":
      return <NetworkScene project={project} progress={progress} />;
    case "fakeguard-ai":
      return <ScanScene project={project} progress={progress} />;
    case "emotion-recognition-speech":
      return <WaveScene project={project} progress={progress} />;
    case "proverdy-data-extraction":
      return <PipelineScene project={project} progress={progress} />;
    default:
      return <ZoomScene project={project} progress={progress} />;
  }
}

function Shot({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={`scene-shot ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} />
    </div>
  );
}

/** AgriConnect: landing page gives way to the feature journey, then the two mobile screens rise in. */
function AgriScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const shots = project.screenshots ?? [];
  const second = useTransform(progress, [0.62, 0.72], [0, 1]);
  const phoneA = useTransform(progress, [0.7, 0.84], ["125%", "0%"]);
  const phoneB = useTransform(progress, [0.8, 0.95], ["125%", "0%"]);
  const caption = useTransform(progress, [0.62, 0.72], [1, 0]);
  if (shots.length < 4) return <ZoomScene project={project} progress={progress} />;
  return (
    <div className="scene scene-agri">
      <div className="scene-browser">
        <span className="scene-browser-bar" aria-hidden="true"><i /><i /><i /></span>
        <div className="scene-browser-view">
          <Shot src={shots[0].src} alt={shots[0].alt} sizes="(min-width: 1024px) 50vw, 92vw" />
          <motion.div className="scene-layer" style={{ opacity: second }}>
            <Shot src={shots[1].src} alt={shots[1].alt} sizes="(min-width: 1024px) 50vw, 92vw" />
          </motion.div>
        </div>
      </div>
      <motion.div className="scene-phone scene-phone-a" style={{ y: phoneA }}>
        <Shot src={shots[2].src} alt={shots[2].alt} sizes="160px" />
      </motion.div>
      <motion.div className="scene-phone scene-phone-b" style={{ y: phoneB }}>
        <Shot src={shots[3].src} alt={shots[3].alt} sizes="160px" />
      </motion.div>
      <span className="scene-caption">
        <motion.span style={{ opacity: caption }}>{shots[0].caption}</motion.span>
        <motion.span style={{ opacity: second }}>{shots[1].caption}</motion.span>
      </span>
    </div>
  );
}

/** NeuroLearn: the dashboard opens from a small circle and settles from a zoom. */
function ZoomScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const shot = project.screenshots?.[0];
  const radius = useTransform(progress, [0.2, 0.75], [16, 80]);
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const scale = useTransform(progress, [0.2, 1], [1.35, 1]);
  const ring = useTransform(progress, [0.2, 0.75], [1, 0]);
  if (!shot) return <PipelineScene project={project} progress={progress} />;
  return (
    <div className="scene scene-zoom">
      <motion.span className="scene-zoom-ring" aria-hidden="true" style={{ opacity: ring }} />
      <motion.div className="scene-zoom-frame" style={{ clipPath: clip }}>
        <motion.div className="scene-fill" style={{ scale }}>
          <Shot src={shot.src} alt={shot.alt} sizes="(min-width: 1024px) 50vw, 92vw" />
        </motion.div>
      </motion.div>
      <span className="scene-caption">{shot.caption}</span>
    </div>
  );
}

const nodeSpots = [
  { x: 200, y: 52 },
  { x: 342, y: 118 },
  { x: 300, y: 252 },
  { x: 100, y: 252 },
  { x: 58, y: 118 },
];

function NetworkLink({ progress, index, to }: { progress: MotionValue<number>; index: number; to: { x: number; y: number } }) {
  const length = useTransform(progress, [0.42 + index * 0.06, 0.6 + index * 0.06], [0, 1]);
  return <motion.line x1={200} y1={160} x2={to.x} y2={to.y} style={{ pathLength: length }} />;
}

function NetworkNode({ progress, index, spot, label }: { progress: MotionValue<number>; index: number; spot: { x: number; y: number }; label: string }) {
  const opacity = useTransform(progress, [0.55 + index * 0.06, 0.65 + index * 0.06], [0, 1]);
  const scale = useTransform(progress, [0.55 + index * 0.06, 0.65 + index * 0.06], [0.6, 1]);
  return (
    <motion.span className="scene-node" style={{ left: `${(spot.x / 400) * 100}%`, top: `${(spot.y / 300) * 100}%`, opacity, scale }}>
      {label}
    </motion.span>
  );
}

/** City Brain: the project's own technologies drawn as an agent network around a central hub. */
function NetworkScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const [hub, ...others] = project.technologies;
  const nodes = others.slice(0, nodeSpots.length);
  const hubScale = useTransform(progress, [0.3, 0.5], [0.4, 1]);
  return (
    <div className="scene scene-network" aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none">
        {nodes.map((_, index) => <NetworkLink key={index} progress={progress} index={index} to={nodeSpots[index]} />)}
      </svg>
      <motion.span className="scene-hub" style={{ scale: hubScale }}>
        <i />
        {hub}
      </motion.span>
      {nodes.map((label, index) => <NetworkNode key={label} progress={progress} index={index} spot={nodeSpots[index]} label={label} />)}
      <span className="scene-caption">{project.subtitle}</span>
    </div>
  );
}

/** FakeGuard: a scan line sweeps across, replacing the landing page with the analyzer interface. */
function ScanScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const shots = project.screenshots ?? [];
  const cover = useTransform(progress, [0.62, 0.95], [100, 0]);
  const clip = useMotionTemplate`inset(0% ${cover}% 0% 0%)`;
  const lineX = useTransform(cover, (value) => `${100 - value}%`);
  const lineOpacity = useTransform(progress, [0.6, 0.64, 0.93, 0.97], [0, 1, 1, 0]);
  if (shots.length < 2) return <ZoomScene project={project} progress={progress} />;
  return (
    <div className="scene scene-scan">
      <div className="scene-browser">
        <span className="scene-browser-bar" aria-hidden="true"><i /><i /><i /></span>
        <div className="scene-browser-view">
          <Shot src={shots[0].src} alt={shots[0].alt} sizes="(min-width: 1024px) 50vw, 92vw" />
          <motion.div className="scene-layer" style={{ clipPath: clip }}>
            <Shot src={shots[1].src} alt={shots[1].alt} sizes="(min-width: 1024px) 50vw, 92vw" />
          </motion.div>
          <motion.span className="scene-scan-line" aria-hidden="true" style={{ left: lineX, opacity: lineOpacity }} />
        </div>
      </div>
      <span className="scene-caption">{shots[1].caption}</span>
    </div>
  );
}

const barCount = 44;
// Rounded so the server and browser print identical transforms.
const barShape = Array.from({ length: barCount }, (_, i) => Math.round((0.18 + 0.82 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.17 + 0.6))) * 100) / 100);

function WaveBar({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const start = 0.3 + (index / barCount) * 0.45;
  const scaleY = useTransform(progress, [start, start + 0.12], [0.04, barShape[index]]);
  return <motion.span style={{ scaleY }} />;
}

function WaveTag({ progress, index, total, label }: { progress: MotionValue<number>; index: number; total: number; label: string }) {
  const at = 0.6 + (index / total) * 0.3;
  const opacity = useTransform(progress, [at, at + 0.06], [0.25, 1]);
  return <motion.li style={{ opacity }}>{label}</motion.li>;
}

/** Emotion recognition: an abstract waveform rises, labelled with the project's actual pipeline. */
function WaveScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  return (
    <div className="scene scene-wave">
      <div className="scene-wave-bars" aria-hidden="true">
        {barShape.map((_, index) => <WaveBar key={index} progress={progress} index={index} />)}
      </div>
      <ol className="scene-wave-steps" aria-label={project.title}>
        {project.technologies.map((tech, index) => (
          <WaveTag key={tech} progress={progress} index={index} total={project.technologies.length} label={tech} />
        ))}
      </ol>
      <span className="scene-caption">{project.subtitle}</span>
    </div>
  );
}

function PipelineStep({ progress, index, text }: { progress: MotionValue<number>; index: number; text: string }) {
  const at = 0.5 + index * 0.13;
  const opacity = useTransform(progress, [at, at + 0.1], [0, 1]);
  const y = useTransform(progress, [at, at + 0.1], [40, 0]);
  return (
    <motion.li style={{ opacity, y }}>
      <span>0{index + 1}</span>
      <p>{text}</p>
    </motion.li>
  );
}

/** ProVerdy: the documented build steps stack up as a pipeline, with the tools that ran it. */
function PipelineScene({ project, progress }: { project: Project; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [0.5, 0.9], [0, 1]);
  return (
    <div className="scene scene-pipeline">
      <ul className="scene-pipeline-tools" aria-hidden="true">
        {project.technologies.map((tech) => <li key={tech}>{tech}</li>)}
      </ul>
      <div className="scene-pipeline-track">
        <span className="scene-pipeline-line" aria-hidden="true"><motion.i style={{ scaleY: fill }} /></span>
        <ol>
          {project.built.map((step, index) => <PipelineStep key={step} progress={progress} index={index} text={step} />)}
        </ol>
      </div>
      <span className="scene-caption">{project.subtitle}</span>
    </div>
  );
}
