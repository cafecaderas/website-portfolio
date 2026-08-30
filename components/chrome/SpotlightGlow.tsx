/** Pairs with onSpotlightMove (spotlight.ts) — put inside any `group` container that sets --mx/--my. */
export function SpotlightGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--rust-lit) 16%, transparent), transparent 70%)",
      }}
    />
  );
}
