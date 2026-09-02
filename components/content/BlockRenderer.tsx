import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import type { ContentBlock } from "@/lib/content/types";
import { SoundCloudEmbed } from "./SoundCloudEmbed";

export interface BlockRendererProps {
  block: ContentBlock;
  className?: string;
  sizes?: string;
}

/** The one place that switches on `ContentBlock.type` — every consumer renders through this. */
export function BlockRenderer({ block, className, sizes }: BlockRendererProps) {
  switch (block.type) {
    case "text":
      return <p className={className}>{block.text}</p>;
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
