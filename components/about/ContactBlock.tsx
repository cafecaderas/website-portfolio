import { social } from "@/lib/content/site";
import { contactContent } from "@/lib/content/about";

export function ContactBlock() {
  return (
    <div className="contact">
      <div className="l">
        <p className="big">{contactContent.bigStatement}</p>
        <p className="lede" style={{ fontSize: "14.5px" }}>
          {contactContent.helperText}
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
