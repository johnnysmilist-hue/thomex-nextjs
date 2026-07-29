import Link from "next/link";
import {
  Store,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  House,
  Cable,
  Tag,
  ChevronRight,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { sidebarCategories } from "@/data/categories";

const iconMap: Record<string, LucideIcon> = {
  store: Store,
  smartphone: Smartphone,
  laptop: Laptop,
  headphones: Headphones,
  watch: Watch,
  camera: Camera,
  "gamepad-2": Gamepad2,
  house: House,
  cable: Cable,
  tag: Tag,
};

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 overflow-hidden rounded-xl border border-base-border bg-base-surface lg:block">
      <div className="flex items-center gap-2 border-b border-base-border px-4 py-3">
        <Menu size={16} className="text-signal-orange" />
        <span className="text-sm font-semibold">All Categories</span>
      </div>
      <nav>
        {sidebarCategories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <Link
              key={cat.name}
              href={cat.slug ? `/category/${cat.slug}` : "#"}
              className="group flex items-center gap-3 border-b border-base-border/60 px-4 py-2.5 text-sm text-ink-muted last:border-0 hover:bg-base-surface2 hover:text-ink-primary"
            >
              <Icon size={15} className="shrink-0 text-ink-faint group-hover:text-signal-orange" />
              <span className="flex-1 truncate">{cat.name}</span>
              <ChevronRight
                size={13}
                className="shrink-0 text-ink-faint opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
