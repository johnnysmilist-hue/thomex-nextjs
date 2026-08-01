import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/getProducts";

function matches(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.toLowerCase());
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q || "").trim();
  const products = await getProducts();

  const results = query
    ? products.filter(
        (p) =>
          matches(p.name, query) ||
          matches(p.category, query) ||
          p.specs.some((s) => matches(s, query))
      )
    : [];

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {!query ? (
          <p className="py-10 text-sm text-ink-muted">
            Type something into the search bar to find products.
          </p>
        ) : (
          <ProductGrid
            products={results}
            emptyMessage={`No products matched "${query}" — try a different search.`}
          />
        )}
      </div>
      <Footer />
    </main>
  );
}
