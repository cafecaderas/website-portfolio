import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import type { ContentBlock } from "@/lib/content/types";
import { SoundCloudEmbed } from "./SoundCloudEmbed";

export interface BlockRendererProps {
  block: ContentBlock;
  className?: string;
  sizes?: string;
}

/**
 * Splits a `text` block's string on `[label](url)` and renders each match as
 * an inline `<a>`, everything else as plain text — a tiny, deliberately
 * narrow parser (this one pattern only, no general HTML/Markdown) so a
 * `text` block can never become an injection surface.
 */
function renderInlineLinks(text: string) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a key={key++} className="inline-link" href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

/** The one place that switches on `ContentBlock.type` — every consumer renders through this. */
export function BlockRenderer({ block, className, sizes }: BlockRendererProps) {
  switch (block.type) {
    case "text":
      return <p className={className}>{renderInlineLinks(block.text)}</p>;
    case "image":
      return <PlaceholderImage src={block.src} alt={block.alt} className={className} sizes={sizes} />;
    case "video":
      return (
        <video
          className={className}
          src={block.src}
          poster={block.poster}
          controls
          style={{ width: "100%" }}
          aria-label={block.caption}
        />
      );
    case "audio":
      return (
        <audio className={className} src={block.src} controls style={{ width: "100%" }} aria-label={block.caption} />
      );
    case "embed":
      return <SoundCloudEmbed item={block} className={className} />;
    case "link":
      return (
        <a className={className ?? "btn"} href={block.url} target="_blank" rel="noopener noreferrer">
          {block.label.toUpperCase()}
        </a>
      );
  }
}
