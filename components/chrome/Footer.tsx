import { footerCopy, social } from "@/lib/content/site";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <span>{footerCopy.handle}</span>
        <span>{footerCopy.tagline}</span>
        <span>
          <a href={social.instagram.href} target="_blank" rel="noopener noreferrer">
            {social.instagram.label}
          </a>{" "}
          <a href={social.soundcloud.href}>{social.soundcloud.label}</a>{" "}
          <a href={social.github.href}>{social.github.label}</a>
        </span>
        <span>{footerCopy.copyright}</span>
      </div>
    </footer>
  );
}
