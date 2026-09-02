import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import type { Testimonial } from "@/lib/content/types";

export interface TestimonialCardProps {
  testimonial: Testimonial;
}

/** A single quote. Reuses .statement (the site's Playfair pull-quote style) rather than inventing a new one. */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { author, role, quote, avatarSrc, avatarAlt, link } = testimonial;

  const byline = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
      {avatarSrc && (
        <PlaceholderImage
          src={avatarSrc}
          alt={avatarAlt ?? author}
          className="row-thumb"
          sizes="44px"
          showTag={false}
        />
      )}
      <span className="mono" style={{ fontSize: 12 }}>
        {author}
        {role && <span style={{ color: "var(--steel-dim)" }}> · {role}</span>}
      </span>
    </div>
  );

  return (
    <figure style={{ margin: 0 }}>
      <blockquote className="statement" style={{ margin: 0 }}>
        “{quote}”
      </blockquote>
      <figcaption>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
            {byline}
          </a>
        ) : (
          byline
        )}
      </figcaption>
    </figure>
  );
}
