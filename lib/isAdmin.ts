// Comma-separated list of emails allowed to use /admin, e.g.
// "you@example.com,partner@example.com" — set as ADMIN_EMAILS in Vercel.
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
