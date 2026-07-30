const KEY = "thomex_recently_viewed_v1";
const MAX_ITEMS = 12;

export function addRecentlyViewed(productId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = [productId, ...ids.filter((id) => id !== productId)].slice(
      0,
      MAX_ITEMS
    );
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore corrupt storage
  }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
