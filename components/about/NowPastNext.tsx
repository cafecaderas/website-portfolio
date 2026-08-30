const COLUMNS = [
  {
    title: "NOW",
    items: [
      { marker: "01", text: "Building Patchbay — signal routing that plays back in the browser.", hi: true },
      { marker: "02", text: "Learning TypeScript properly. Types before tricks.", hi: false },
      { marker: "03", text: "Taking on two client projects for the back half of 2026.", hi: false },
    ],
  },
  {
    title: "PAST",
    items: [
      { marker: "—", text: "Made records. Tracked, mixed, mastered, played out most weekends.", hi: false },
      { marker: "—", text: "Moved into design; led product and brand work in-house.", hi: false },
      { marker: "—", text: "Started building the tools instead of waiting for them.", hi: false },
    ],
  },
  {
    title: "NEXT",
    items: [
      { marker: "→", text: "Fewer, larger projects where I own both the build and the direction.", hi: true },
      { marker: "→", text: "Shipping the lab tools as real products.", hi: false },
      { marker: "→", text: "A studio, eventually. Small one.", hi: false },
    ],
  },
] as const;

export function NowPastNext() {
  return (
    <div className="npn">
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h3>{col.title}</h3>
          <ul>
            {col.items.map((item) => (
              <li key={item.marker + item.text} className={item.hi ? "hi" : undefined}>
                <b>{item.marker}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
