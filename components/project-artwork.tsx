"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";

export function ProjectArtwork({ project, className = "" }: { project: Project; className?: string }) {
  const screenshot = project.screenshots?.[0];
  if (!screenshot) return null;
  return <figure className={`project-art ${className}`}>
    <Image src={screenshot.src} alt={screenshot.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 80vw, 55vw" />
    <figcaption>{screenshot.caption}</figcaption>
  </figure>;
}

export function ProjectGallery({ project }: { project: Project }) {
  const shots = project.screenshots ?? [];
  const [active, setActive] = useState(0);
  if (!shots.length) return null;
  const shot = shots[active];
  function move(direction: number) { setActive((current) => (current + direction + shots.length) % shots.length); }
  return <div className={`project-gallery ${project.slug === "agriconnect" ? "project-gallery-agriconnect" : ""}`}>
    <figure className="project-art project-gallery-main">
      <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 80vw, 70vw" />
      <figcaption>{shot.caption}</figcaption>
    </figure>
    {shots.length > 1 && <div className="gallery-controls" aria-label={`${project.title} screenshot gallery`}>
      <button type="button" onClick={() => move(-1)} aria-label="Previous screenshot"><ArrowLeft size={18}/></button>
      <span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}</span>
      {shots.map((item, index) => <button key={item.src} type="button" className={`gallery-thumb ${index === active ? "is-active" : ""}`} onClick={() => setActive(index)} aria-label={`Show screenshot ${index + 1}: ${item.caption}`} aria-pressed={index === active}>
        <Image src={item.src} alt="" fill sizes="(max-width: 700px) 80px, 120px" />
      </button>)}
      <button type="button" onClick={() => move(1)} aria-label="Next screenshot"><ArrowRight size={18}/></button>
    </div>}
    {project.slug === "agriconnect" && <div className="architecture-overview" aria-label="Architecture overview: farmer interface connects to a FastAPI backend, with language model assistance, visual pest detection, and agricultural regulatory knowledge">
      <span className="eyebrow">ARCHITECTURE OVERVIEW</span>
      <div className="architecture-flow"><span>Farmer interface</span><i aria-hidden="true">→</i><span>FastAPI backend</span><i aria-hidden="true">→</i><div><span>LLM assistance</span><span>VLM pest detection</span><span>Regulatory knowledge base</span></div></div>
      <small>Based on the documented project components</small>
    </div>}
  </div>;
}
