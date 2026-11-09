import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main id="main" className="not-found"><span className="eyebrow">ERROR / 404</span><h1>Page not found<span>.</span></h1><p>The page you’re looking for doesn’t exist or may have moved.</p><Link className="button button-primary" href="/"><ArrowLeft size={16}/> Return home</Link></main>;
}
