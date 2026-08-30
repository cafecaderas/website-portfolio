import { social } from "@/lib/content/site";
import { cvHeading, cvEntries } from "@/lib/content/about";

export function CvTable() {
  return (
    <div className="cv">
      <div className="cv-hd">
        <span>{cvHeading.label}</span>
        <a href={social.cv.href} style={{ color: "var(--steel-faint)" }}>
          {cvHeading.pdfLabel}
        </a>
      </div>
      {cvEntries.map((entry) => (
        <div className="cvrow" key={entry.years}>
          <span className="yr mono">{entry.years}</span>
          <span className="ro">
            {entry.role}
            <span>{entry.description}</span>
          </span>
          <span className="pl">{entry.place}</span>
        </div>
      ))}
    </div>
  );
}
