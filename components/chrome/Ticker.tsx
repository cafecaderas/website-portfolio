import { tickerLines } from "@/lib/content/site";

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

/** Marquee strip, used on HOME under the hero only. */
export function Ticker() {
  const doubled = [...tickerLines, ...tickerLines];
  return (
    <div className="ticker">
      <div className="ticker-in">
        {doubled.map((line, i) => renderLine(line, `${line}-${i}`))}
      </div>
    </div>
  );
}
