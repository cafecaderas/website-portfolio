import { Scope } from "@/components/canvas/Scope";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import type { ProjectCore } from "@/lib/content/types";

const FALLBACK_COVER = {
  src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=70",
  alt: "Album cover placeholder",
};

/**
 * The old LAB-index NowPlayingBar, ported to run per-project instead of as
 * one hardcoded global widget — same markup/CSS (`.nowbar`), driven by
 * `core` instead of a fixed copy object. Gated by `core.audioPlayer`, not
 * real audio data: this is a visual placeholder, not a player wired to a
 * `body` audio block (see the field's doc comment in lib/content/types.ts).
 */
export function AudioPlayerPlaceholder({ core }: { core: ProjectCore }) {
  const cover = core.cover ?? FALLBACK_COVER;
  const readout = [core.title, core.meta].filter(Boolean).join(" — ");

  return (
    <div className="nowbar">
      <PlaceholderImage src={cover.src} alt={cover.alt} className="cover" sizes="56px" showTag={false} />
      <span className="lab">
        <span className="led-dot animate__animated animate__pulse animate__infinite" />
        NOW PLAYING
      </span>
      <span className="sc">
        <Scope mode="bars" />
      </span>
      <span className="rt mono">{readout}</span>
    </div>
  );
}
