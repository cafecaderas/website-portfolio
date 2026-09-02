import { tickerLines } from "@/lib/content/site";
import { SectionFieldLoader } from "@/components/three/SectionFieldLoader";

function renderLine(text: string, key: string) {
  const parts = text.split(/([×·])/g);
  return (
    <span key={key}>
      {parts.map((part, i) =>
        part === "×" || part === "·" ? <b key={i}>{part}</b> : part,
      )}
    </span>
  );
}

/**
 * Marquee strip, used on HOME under the hero only. The scrolling text is
 * plain CSS animation exactly as before — the reactive layer sits behind it
 * as a level-meter field (`ticker` preset) and changes nothing about how the
 * marquee itself works.
 */
export function Ticker() {
  const doubled = [...tickerLines, ...tickerLines];
  return (
    <div className="ticker milled bezel">
      <SectionFieldLoader preset="ticker" />
      <div className="ticker-in">
        {doubled.map((line, i) => renderLine(line, `${line}-${i}`))}
      </div>
    </div>
  );
}
