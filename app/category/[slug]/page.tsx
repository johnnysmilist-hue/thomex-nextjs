import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/getProducts";
import { shopCategories } from "@/data/categories";
import { slugify } from "@/lib/slug";

export function generateStaticParams() {
  return shopCategories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = shopCategories.find((c) => c.slug === params.slug);
  const label = category?.name ?? params.slug.replace(/-/g, " ");

  const products = await getProducts();
  const items = products.filter((p) => slugify(p.category) === params.slug);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center gap-1.5 text-sm text-ink-faint">
          <Link href="/" className="hover:text-ink-primary">
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-ink-primary">{label}</span>
        </div>

        <h1 className="mb-6 font-display text-2xl font-bold capitalize">
          {label}
        </h1>

        <ProductGrid products={items} />
      </div>
      <Footer />
    </main>
  );
}
