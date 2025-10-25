"use client";

import React from "react";
import { useParams } from "next/navigation";
import { HotelDetail } from "./components/hotel-detail";
import { useGetHotelById } from "@/api-config/queries/hotel";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { Loader2 } from "lucide-react";

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.id as string;

  const {
    data: hotel,
    isLoading,
    error,
    } = useGetHotelById(hotelId);
    
    console.log("hotel", hotel);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-active" />
          <span className="text-lg text-primary">Loading hotel details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load hotel details. Please try again."
      />
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Hotel Not Found</h1>
          <p className="text-primary">The hotel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <HotelDetail hotel={hotel} />;
}
