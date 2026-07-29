"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, ShoppingCart, PackageSearch } from "lucide-react";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useCart } from "@/context/CartContext";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { toggle } = useMobileMenu();
  const { itemCount } = useCart();

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href);

  const linkClass = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
      active ? "text-signal-orange" : "text-ink-faint"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-base-border bg-base-bg/95 backdrop-blur md:hidden">
      <Link href="/" className={linkClass(pathname === "/")}>
        <House size={19} />
        Home
      </Link>
      <button onClick={toggle} className={linkClass(false)}>
        <LayoutGrid size={19} />
        Categories
      </button>
      <Link href="/cart" className={`relative ${linkClass(isActive("/cart"))}`}>
        <span className="relative">
          <ShoppingCart size={19} />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-signal-orange text-[9px] font-semibold text-base-bg">
              {itemCount}
            </span>
          )}
        </span>
        Cart
      </Link>
      <Link href="/track" className={linkClass(isActive("/track"))}>
        <PackageSearch size={19} />
        Track
      </Link>
    </nav>
  );
}
