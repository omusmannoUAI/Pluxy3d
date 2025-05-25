import HeroSection from "./HeroSection.js"
import FeaturesSection from "./FeaturesSection.js"
import FeaturedProductsSection from "./FeaturedProductsSection.js"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
    </main>
  )
}
