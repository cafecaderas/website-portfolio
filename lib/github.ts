/**
 * One unauthenticated call to the public GitHub API, cached via Next's
 * fetch revalidation — stays well under GitHub's unauthenticated rate
 * limit for a low-traffic portfolio site. Never throws: callers get
 * `null` on any failure and fall back to static content.
 */
export async function getRepoLastPush(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (typeof data !== "object" || data === null || !("pushed_at" in data)) return null;
    const pushedAt = (data as { pushed_at: unknown }).pushed_at;
    return typeof pushedAt === "string" ? pushedAt : null;
  } catch {
    return null;
  }
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return minutes <= 1 ? "JUST NOW" : `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}D AGO`;
  return `${Math.floor(days / 30)}MO AGO`;
}
