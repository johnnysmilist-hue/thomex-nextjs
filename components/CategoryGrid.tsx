import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  House,
  Cable,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/data/products";

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  headphones: Headphones,
  watch: Watch,
  camera: Camera,
  "gamepad-2": Gamepad2,
  house: House,
  cable: Cable,
};

export default function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-6 font-display text-xl font-bold">Shop by category</h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <a
              key={cat.name}
              href="#"
              className="group flex flex-col items-center gap-2 rounded-xl border border-base-border bg-base-surface p-4 text-center transition hover:border-signal-orange/50 hover:bg-base-surface2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-base-surface2 text-signal-orange group-hover:bg-signal-orange group-hover:text-base-bg">
                <Icon size={18} />
              </span>
              <span className="text-xs font-medium text-ink-muted group-hover:text-ink-primary">
                {cat.name}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
