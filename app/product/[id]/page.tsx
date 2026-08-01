import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import ProductRail from "@/components/ProductRail";
import ReviewsSection from "@/components/ReviewsSection";
import { getProducts } from "@/lib/getProducts";
import { getReviews } from "@/lib/getReviews";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const related = products.filter((p) => p.id !== product.id).slice(0, 6);
  const reviews = await getReviews(product.id);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ProductDetail product={product} />
      </div>
      <ReviewsSection productId={product.id} initialReviews={reviews} />
      <ProductRail title="You might also like" items={related} />
      <Footer />
    </main>
  );
}
