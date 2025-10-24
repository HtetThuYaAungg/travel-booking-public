"use client";
import React from "react";
import { HeroSection } from "@/components/hero-section";
import { SearchSection } from "@/components/search-section";
import { FeaturedHotels } from "@/components/featured-hotels";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Page() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <FeaturedHotels />
      <WhyChooseUs />
    </div>
  );
}
