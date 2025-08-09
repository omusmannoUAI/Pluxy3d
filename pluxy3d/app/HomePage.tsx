import HeroSection from "./HeroSection"
import FeaturesSection from "./FeaturesSection"
import FeaturedProductsSection from "./FeaturedProductsSection"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
    </main>
  )
}
