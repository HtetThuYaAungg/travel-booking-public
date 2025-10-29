"use client";
import React, { useState } from "react";
import { FlightList } from "@/app/(root)/flights/components/flight-list";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import FlightFilters from "./components/flight-filters";

export default function FlightsPage() {
  const [filter, setFilter] = useState<
    Record<string, string | number | boolean>
  >({
    page: defaultPageNo,
    limit: defaultPageSize,
  });

  const handleSearch = (searchData: {
    departure: string;
    arrival: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
  }) => {
    const newFilter: Record<string, string | number | boolean> = {
      page: defaultPageNo,
      limit: defaultPageSize,
    };

    if (searchData.departure) {
      newFilter.departure_airport_code = searchData.departure;
    }
    if (searchData.arrival) {
      newFilter.arrival_airport_code = searchData.arrival;
    }
    if (searchData.departureDate) {
      newFilter.departure_date = searchData.departureDate;
    }
    if (searchData.returnDate) {
      newFilter.arrival_date = searchData.returnDate;
    }
    if (searchData.passengers) {
      newFilter.passengers = searchData.passengers;
    }

    setFilter(newFilter);
  };

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
            Find Your Perfect Flight
          </h1>
          <p className="text-xl text-primary">
            Book flights to destinations around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-2/6">
            <FlightFilters filter={filter} setFilter={setFilter} />
          </div>

          {/* Flights List */}
          <div className="lg:w-4/6">
            <FlightList filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}

