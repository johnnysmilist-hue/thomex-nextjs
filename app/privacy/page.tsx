import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ORDER_EMAIL, ORDER_WHATSAPP_NUMBER } from "@/data/config";

export const metadata = {
  title: "Privacy Policy — Thomex",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 font-display text-lg font-semibold text-ink-primary">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
        <p className="mb-8 text-xs text-ink-faint">Last updated: [add the date you publish this]</p>

        <div className="mb-10 rounded-xl border border-signal-orange/30 bg-signal-orange/10 p-4 text-sm text-ink-muted">
          <strong className="text-ink-primary">Before you publish this:</strong> this
          describes what the site actually does with data today — worth a legal review
          before launch, and worth updating any time you add a new feature that collects or
          shares customer data.
        </div>

        <Section title="1. What we collect">
          <p>When you use Thomex, we may collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name, phone number, and delivery location — when you check out or contact us</li>
            <li>Email address and password — if you create an account (your password is never stored in plain text; Supabase, our account provider, handles that securely)</li>
            <li>Order history — items bought, amounts, and delivery status</li>
            <li>Cart, wishlist, and recently-viewed items — stored in your own browser, not on our servers, unless you're signed in</li>
            <li>Reviews you choose to post, shown with your account name</li>
          </ul>
          <p>
            We don't collect or store M-Pesa PINs or card numbers — payments are handled
            directly by Safaricom.
          </p>
        </Section>

        <Section title="2. How we use it">
          <ul className="list-disc space-y-1 pl-5">
            <li>To process and deliver your orders</li>
            <li>To contact you about an order (via WhatsApp, email, or phone)</li>
            <li>To let you sign in, track past orders, and manage your wishlist</li>
            <li>To show your name alongside reviews you post</li>
            <li>To improve the site and catalog over time</li>
          </ul>
          <p>We don't sell your personal information to third parties.</p>
        </Section>

        <Section title="3. Where it's stored">
          <p>
            Order, account, and review data is stored in a hosted database (Supabase).
            Product photos you might see us using are stored the same way. Reasonable
            security measures are in place, but no online service can guarantee absolute
            security.
          </p>
        </Section>

        <Section title="4. Third parties involved">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-ink-primary">Safaricom (M-Pesa)</strong> — processes
              payments made at checkout; subject to Safaricom's own privacy practices
            </li>
            <li>
              <strong className="text-ink-primary">WhatsApp</strong> — used to send/receive
              order messages if you choose that contact option
            </li>
            <li>
              <strong className="text-ink-primary">Supabase</strong> — hosts our database
              and handles account sign-in
            </li>
            <li>
              <strong className="text-ink-primary">Vercel</strong> — hosts the website itself
            </li>
          </ul>
        </Section>

        <Section title="5. Your choices">
          <p>
            You can ask us to see, correct, or delete the personal data we hold about you —
            contact us using the details below. Deleting your account removes your profile;
            we may retain order records as needed for accounting or legal purposes.
          </p>
        </Section>

        <Section title="6. Cookies and local storage">
          <p>
            We don't use tracking or advertising cookies. Your cart, wishlist, and recently
            viewed items are kept in your browser's local storage so they persist between
            visits — this data stays on your device and isn't sent to us unless you check
            out or sign in.
          </p>
        </Section>

        <Section title="7. Changes to this policy">
          <p>
            We may update this policy as the site changes. We'll update the date at the top
            when we do.
          </p>
        </Section>

        <Section title="8. Contact us">
          <p>
            Questions about your data? Reach us at{" "}
            <a href={`mailto:${ORDER_EMAIL}`} className="text-signal-orange hover:text-signal-amber">
              {ORDER_EMAIL}
            </a>{" "}
            or via{" "}
            <a
              href={`https://wa.me/${ORDER_WHATSAPP_NUMBER}`}
              className="text-signal-orange hover:text-signal-amber"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
        </Section>
      </div>
      <Footer />
    </main>
  );
}
