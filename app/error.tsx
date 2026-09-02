"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Root error boundary — Next mounts this in place of any page's content
 * when a render throws beneath it. Must be a Client Component (Next
 * requirement: it needs the `reset` callback and its own error handling).
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="pagehead">
      <div className="wrap">
        <p className="eyebrow">
          <span className="led-dot" style={{ background: "var(--rust)", boxShadow: "none" }} />
          SIGNAL LOST
        </p>
        <h1 className="h1">
          SOMETHING
          <br />
          <em>DROPPED OUT.</em>
        </h1>
        <p className="lede">
          The page hit an error while rendering. Reset picks the signal back up — if it keeps
          cutting out, head back to the top and try again from there.
        </p>
        {error.digest && (
          <p className="mono" style={{ fontSize: 11, color: "var(--steel-faint)", marginTop: 10 }}>
            REF {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
          <button type="button" className="btn solid" onClick={reset}>
            TRY AGAIN
          </button>
          <Link href="/" className="btn">
            BACK TO HOME
          </Link>
        </div>
      </div>
    </section>
  );
}
