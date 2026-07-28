import { products, type Product } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductRail({
  title,
  items,
}: {
  title: string;
  items?: Product[];
}) {
  const list = items ?? products;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-6 font-display text-xl font-bold">{title}</h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-6">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
