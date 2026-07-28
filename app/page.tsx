import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import CategoryGrid from "@/components/CategoryGrid";
import FlashSales from "@/components/FlashSales";
import ProductRail from "@/components/ProductRail";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <CategoryGrid />
      <ProductRail title="Top selling items" items={products} />
      <TrustStrip />
      <FlashSales />
      <ProductRail title="Recommended for you" items={[...products].reverse()} />
      <Footer />
    </main>
  );
}
