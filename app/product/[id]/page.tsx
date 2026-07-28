import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import ProductRail from "@/components/ProductRail";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 6);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ProductDetail product={product} />
      </div>
      <ProductRail title="You might also like" items={related} />
      <Footer />
    </main>
  );
}
