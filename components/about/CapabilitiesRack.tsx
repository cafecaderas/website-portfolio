import { capabilitiesContent } from "@/lib/content/about";

/** The README's "Career alignment" pillars, surfaced as a channel rack. */
export function CapabilitiesRack() {
  return (
    <>
      <p className="eyebrow" style={{ marginTop: 46 }}>
        {capabilitiesContent.eyebrow}
      </p>
      <div className="rack">
        {capabilitiesContent.channels.map((channel) => (
          <div className="rack-ch" key={channel.label}>
            <div className="k">{channel.label}</div>
            <p className="v">{channel.body}</p>
            <div className="chips">
              {channel.tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
