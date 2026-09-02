import type { Testimonial } from "@/lib/content/types";
import { TestimonialCard } from "./TestimonialCard";

export interface TestimonialStripProps {
  testimonials: Testimonial[];
}

/** Renders nothing until real quotes exist — no lorem placeholders. */
export function TestimonialStrip({ testimonials }: TestimonialStripProps) {
  if (testimonials.length === 0) return null;

  return (
    <div style={{ display: "grid", gap: 32 }}>
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}
