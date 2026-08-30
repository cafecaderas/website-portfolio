import { social } from "@/lib/content/site";

const CV = [
  [
    "2024 — NOW",
    "Independent — creative technologist",
    "Websites, digital experiences, and art direction for music and hospitality clients.",
    "BOGOTÁ / REMOTE",
  ],
  [
    "2021 — 2024",
    "Design lead",
    "Led product and brand design across a small in-house team; shipped the design system.",
    "IN-HOUSE",
  ],
  [
    "2018 — 2021",
    "Audio engineer",
    "Tracking, mixing, and mastering. Live sound most weekends.",
    "STUDIO / LIVE",
  ],
  [
    "2016 — 2018",
    "Started making records",
    "Which is still the reason for all of the above.",
    "—",
  ],
] as const;

export function CvTable() {
  return (
    <div className="cv">
      <div className="cv-hd">
        <span>CV — CONTEXT, NOT ARCHITECTURE</span>
        <a href={social.cv.href} style={{ color: "var(--steel-faint)" }}>
          PDF ↓
        </a>
      </div>
      {CV.map((row) => (
        <div className="cvrow" key={row[0]}>
          <span className="yr mono">{row[0]}</span>
          <span className="ro">
            {row[1]}
            <span>{row[2]}</span>
          </span>
          <span className="pl">{row[3]}</span>
        </div>
      ))}
    </div>
  );
}
