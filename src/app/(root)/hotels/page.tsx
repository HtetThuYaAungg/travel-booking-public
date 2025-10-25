"use client";
import React, { useState } from "react";
import { HotelList } from "@/app/(root)/hotels/components/hotel-list";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import HotelFilters from "./components/hotel-filters";

export default function HotelsPage() {

    const [filter, setFilter] = useState<
      Record<string, string | number | boolean>
    >({
      page: defaultPageNo,
      limit: defaultPageSize,
    });
  


  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <div
        className="text-white py-16 relative"
        style={{ backgroundImage: "url(/logo/hero-bg.png)" }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-active">
            Find Your Perfect Hotel
          </h1>
          <p className="text-xl text-primary">
            Discover amazing accommodations for your next trip
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-2/6">
            <HotelFilters filter={filter} setFilter={setFilter} />
          </div>

          {/* Hotels List */}
          <div className="lg:w-4/6">
            <HotelList filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}

