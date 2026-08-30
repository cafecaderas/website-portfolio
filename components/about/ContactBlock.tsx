import { social } from "@/lib/content/site";

export function ContactBlock() {
  return (
    <div className="contact">
      <div className="l">
        <p className="big">
          Tell me what you&apos;re making and what it&apos;s supposed to feel
          like.
        </p>
        <p className="lede" style={{ fontSize: "14.5px" }}>
          Best first message: what it is, when you need it, and one thing
          you&apos;ve seen that got it right. I answer everything within a
          couple of days.
        </p>
        <div style={{ marginTop: 22 }}>
          <a className="btn solid" href={`mailto:${social.email}`}>
            {social.email.toUpperCase()}
          </a>
        </div>
      </div>
      <div className="r">
        <a
          className="linkline"
          href={social.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{social.instagram.label}</span>
          <span>{social.instagram.handle}</span>
        </a>
        <a className="linkline" href={social.soundcloud.href}>
          <span>{social.soundcloud.label}</span>
          <span>{social.soundcloud.handle}</span>
        </a>
        <a className="linkline" href={social.github.href}>
          <span>{social.github.label}</span>
          <span>{social.github.handle}</span>
        </a>
        <a className="linkline" href={social.cv.href}>
          <span>{social.cv.label}</span>
          <span>{social.cv.handle}</span>
        </a>
      </div>
    </div>
  );
}
