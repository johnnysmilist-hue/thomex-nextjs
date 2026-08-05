import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import MobileMenu from "@/components/MobileMenu";
import MobileTabBar from "@/components/MobileTabBar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Thomex — Tech, done right",
  description:
    "Thomex is an electronics and gadget store: phones, laptops, audio, and smart home gear, picked for spec and value.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-base-bg pb-14 text-ink-primary antialiased md:pb-0`}
      >
        <CartProvider>
          <WishlistProvider>
            <AuthProvider>
              <SettingsProvider>
                <MobileMenuProvider>
                  {children}
                  <MobileMenu />
                  <MobileTabBar />
                </MobileMenuProvider>
              </SettingsProvider>
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
