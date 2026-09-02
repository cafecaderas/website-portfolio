import type { ContentBlock } from "@/lib/content/types";

export interface SoundCloudEmbedProps {
  item: Extract<ContentBlock, { type: "embed" }>;
  className?: string;
}

/**
 * SoundCloud's own widget iframe — no SDK, no new dependency. The same
 * `url` param renders a public track, an unlisted "secret" share URL, or a
 * playlist identically; there is no separate private-content mode to wire.
 */
export function SoundCloudEmbed({ item, className }: SoundCloudEmbedProps) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(item.url)}&color=%23ff0000&auto_play=false&show_user=true`;

  return (
    <iframe
      className={className}
      title={item.caption ?? "SoundCloud player"}
      src={src}
      width="100%"
      height="166"
      loading="lazy"
      allow="autoplay"
      style={{ border: "none" }}
    />
  );
}
