import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectDetailView } from "@/components/project-detail-view";

export function generateStaticParams() {
  return projects.filter(({ status }) => status === "Case study").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? { title: `${project.title} — Project`, description: project.summary }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudies = projects.filter((item) => item.status === "Case study");
  const index = caseStudies.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();

  const project = caseStudies[index];
  const previous = caseStudies[(index + caseStudies.length - 1) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return <ProjectDetailView project={project} previous={previous} next={next} />;
}
