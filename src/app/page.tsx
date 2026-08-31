import { HeaderTone } from "@/lib/store";
import { Hero } from "@/components/home/Hero";
import { HouseStrip } from "@/components/home/HouseStrip";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Categories } from "@/components/home/Categories";
import { BestSellers } from "@/components/home/BestSellers";
import { Editorial } from "@/components/home/Editorial";
import { CompleteLook } from "@/components/home/CompleteLook";
import { TryOnShowcase } from "@/components/home/TryOnShowcase";
import { Services, Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeaderTone tone="light" />
      <Hero />
      <HouseStrip />
      <FeaturedCollection />
      <NewArrivals />
      <Categories />
      <BestSellers />
      <Editorial />
      <CompleteLook />
      <TryOnShowcase />
      <Services />
      <Newsletter />
    </>
  );
}
