import Image from "next/image";

export interface PlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Set false for spots where the tag would clutter a small thumbnail. */
  showTag?: boolean;
}

/**
 * A next/image wrapper for swap-ready stand-in imagery. Every spot using
 * this renders the same small mono corner tag so placeholder content never
 * gets mistaken for final art.
 */
export function PlaceholderImage({ src, alt, className, sizes, showTag = true }: PlaceholderImageProps) {
  return (
    <div className={`ph-img${className ? ` ${className}` : ""}`}>
      <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} style={{ objectFit: "cover" }} />
      {showTag && <span className="ph-img-tag mono">PLACEHOLDER</span>}
    </div>
  );
}
