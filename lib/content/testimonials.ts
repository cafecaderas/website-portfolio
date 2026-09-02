import type { Testimonial } from "./types";

/** Ships empty until real client quotes exist — no lorem placeholders here. */
export const testimonials: Testimonial[] = [];

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getTestimonialsForProject(slug: string): Testimonial[] {
  return testimonials.filter((testimonial) => testimonial.projectSlug === slug);
}
