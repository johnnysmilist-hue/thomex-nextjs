"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Review } from "@/lib/getReviews";

function StarRow({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={n <= value ? "fill-signal-amber text-signal-amber" : "text-ink-faint"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment || "");
    }
    // Only re-run when the signed-in user (and thus their review) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myReview?.id, user?.id]);

  const submit = async () => {
    if (rating < 1) {
      setError("Pick a star rating first");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save review");

      const mine: Review = {
        id: myReview?.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        product_id: productId,
        user_id: user!.id,
        customer_name:
          (user!.user_metadata?.full_name as string) || user!.email?.split("@")[0] || "You",
        rating,
        comment: comment.trim() || null,
      };
      setReviews((prev) => [mine, ...prev.filter((r) => r.user_id !== user!.id)]);
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setReviews((prev) => prev.filter((r) => r.user_id !== user.id));
      setRating(0);
      setComment("");
    } finally {
      setSaving(false);
    }
  };

  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-display text-xl font-bold">Reviews</h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-ink-muted">
            <StarRow value={Math.round(avg)} size={15} />
            {avg} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {!authLoading && (
        <div className="mb-8 rounded-xl border border-base-border bg-base-surface p-4">
          {!user ? (
            <p className="text-sm text-ink-muted">
              <Link href="/signin" className="text-signal-orange hover:text-signal-amber">
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          ) : (
            <div>
              <p className="mb-2 text-sm font-medium text-ink-primary">
                {myReview ? "Edit your review" : "Leave a review"}
              </p>
              <StarRow value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="What did you think?"
                className="mt-3 w-full rounded-lg border border-base-border bg-base-surface2 px-3 py-2 text-sm focus:border-signal-orange focus:outline-none"
              />
              {error && <p className="mt-2 text-xs text-signal-orange">{error}</p>}
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={submit}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-signal-orange px-4 py-2 text-sm font-semibold text-base-bg hover:bg-signal-amber disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {myReview ? "Update review" : "Submit review"}
                </button>
                {myReview && (
                  <button
                    onClick={remove}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-signal-orange"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-ink-muted">No reviews yet — be the first.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-base-border bg-base-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium text-ink-primary">{r.customer_name}</p>
                <span className="text-xs text-ink-faint">
                  {new Date(r.created_at).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <StarRow value={r.rating} size={14} />
              {r.comment && <p className="mt-2 text-sm text-ink-muted">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
