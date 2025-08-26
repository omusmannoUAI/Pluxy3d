import HeroCarousel from "./HeroCarousel"
import FeaturesSection from "./FeaturesSection"
import FeaturedProductsSection from "./FeaturedProductsSection"
import BenefitsStrip from "./BenefitsStrip"
import CategoriesGrid from "./CategoriesGrid"
import TestimonialsSection from "./TestimonialsSection"
import NewsletterSection from "./NewsletterSection"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
  <HeroCarousel />
  <BenefitsStrip />
      <FeaturesSection />
      <FeaturedProductsSection />
  <CategoriesGrid />
  <TestimonialsSection />
  <NewsletterSection />
    </main>
  )
}
