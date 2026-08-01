import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ORDER_EMAIL, ORDER_WHATSAPP_NUMBER } from "@/data/config";

export const metadata = {
  title: "Terms & Conditions — Thomex",
};

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mb-8 scroll-mt-24">
      <h2 className="mb-2 font-display text-lg font-semibold text-ink-primary">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 font-display text-2xl font-bold sm:text-3xl">
          Terms &amp; Conditions
        </h1>
        <p className="mb-8 text-xs text-ink-faint">Last updated: [add the date you publish this]</p>

        <div className="mb-10 rounded-xl border border-signal-orange/30 bg-signal-orange/10 p-4 text-sm text-ink-muted">
          <strong className="text-ink-primary">Before you publish this:</strong> this is a
          starting template covering the basics for a small Kenyan online store, not a
          substitute for legal advice. It's worth having a lawyer look over the final wording,
          especially the return/refund and liability sections, before customers start
          agreeing to it.
        </div>

        <Section title="1. Who we are">
          <p>
            Thomex ("we", "us", "our") operates this website to sell electronics and
            related accessories to customers in Kenya. By placing an order or creating an
            account, you agree to these terms.
          </p>
        </Section>

        <Section title="2. Orders and pricing">
          <p>
            All prices are shown in Kenyan Shillings (KSh) and include any applicable taxes
            unless stated otherwise. We try to keep prices and stock levels accurate, but
            errors can happen — if something is mispriced or out of stock after you order,
            we'll contact you before proceeding, and you're free to cancel.
          </p>
          <p>
            Placing an order is an offer to buy; it's only confirmed once we accept it
            (typically by confirming your order over WhatsApp or email, or once M-Pesa
            payment is received).
          </p>
        </Section>

        <Section title="3. Payment">
          <p>
            We currently accept payment on delivery (cash or M-Pesa) and M-Pesa payment at
            checkout via STK push to your phone. Any payment made via M-Pesa is subject to
            Safaricom's own terms for that service — we never see or store your M-Pesa PIN.
          </p>
        </Section>

        <Section title="4. Delivery" id="delivery">
          <p>
            We deliver nationwide. Delivery times given at checkout or on the site are
            estimates, not guarantees — factors outside our control (weather, courier
            delays, remote locations) can affect them. Please make sure your delivery
            address and phone number are accurate; we're not responsible for delays caused
            by incorrect details.
          </p>
        </Section>

        <Section title="5. Returns and refunds" id="returns">
          <p>
            We offer a 7-day return window from the day you receive your order. To be
            eligible, an item should be unused, in its original packaging, and not damaged
            through misuse. To start a return, contact us via WhatsApp or email with your
            order details.
          </p>
          <p>
            Refunds for returned items are issued to the original payment method (M-Pesa)
            or, for pay-on-delivery orders, by arrangement — typically within a few business
            days of us receiving the returned item.
          </p>
        </Section>

        <Section title="6. Product descriptions">
          <p>
            We do our best to describe products, specs, and images accurately. Actual
            packaging or minor details may occasionally differ slightly from what's shown.
            If something you receive doesn't match its description in a meaningful way,
            that's covered under returns above.
          </p>
        </Section>

        <Section title="7. Accounts">
          <p>
            If you create an account, you're responsible for keeping your login details
            secure and for activity that happens under your account. Let us know right away
            if you think someone else has accessed it.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the extent permitted by law, Thomex isn't liable for indirect or
            consequential losses arising from use of this site or our products, beyond the
            value of the order in question. Nothing here limits any right you have under
            Kenyan consumer protection law.
          </p>
        </Section>

        <Section title="9. Changes to these terms">
          <p>
            We may update these terms from time to time — for example, as we add new
            payment methods or delivery options. Continued use of the site after changes
            means you accept the updated terms.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>These terms are governed by the laws of Kenya.</p>
        </Section>

        <Section title="11. Contact us">
          <p>
            Questions about these terms? Reach us at{" "}
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
