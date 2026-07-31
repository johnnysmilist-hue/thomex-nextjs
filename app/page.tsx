import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import CategoryGrid from "@/components/CategoryGrid";
import FlashSales from "@/components/FlashSales";
import ProductRail from "@/components/ProductRail";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/getProducts";

export default async function Home() {
  const products = await getProducts();
  const deals = products.filter((p) => p.oldPrice);

  return (
    <main>
      <Header />
      <Hero />
      <CategoryGrid />
      <ProductRail title="Top selling items" items={products} />
      <TrustStrip />
      <FlashSales items={deals} />
      <ProductRail title="Recommended for you" items={[...products].reverse()} />
      <Footer />
    </main>
  );
}
