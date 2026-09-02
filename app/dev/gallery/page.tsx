import { notFound } from "next/navigation";
import { GalleryLoader } from "@/components/gallery/GalleryLoader";

/**
 * Every UI module in isolation — the "component gallery" noted as a future
 * idea in AGENTS.md. Dev-only, same gate as the Tweak Bar: a production
 * visitor gets a real 404, not just a hidden route.
 */
export default function GalleryPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <GalleryLoader />;
}
