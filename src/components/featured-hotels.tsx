"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useGetFeaturedHotels } from "@/api-config/queries/hotel";
import { Hotel } from "@/api-config/services/hotel";

export function FeaturedHotels() {
  const { isAuthenticated } = useAuth();
  const { data: featuredHotelsData, isLoading, error } = useGetFeaturedHotels(3);
  
  const featuredHotels = featuredHotelsData?.data?.items || [];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-active mb-4">
            Featured Hotels
          </h2>
          <p className="text-lg text-primary">
            Discover our most popular accommodations
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-active" />
            <span className="ml-2 text-primary">Loading featured hotels...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load featured hotels</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : featuredHotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary">No featured hotels available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHotels.map((hotel: Hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 py-0">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-active/30 to-active/60 flex items-center justify-center">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img 
                        src={hotel.images[0]} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-semibold">Hotel Image</span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-active/70 hover:bg-active/90 text-white px-2 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900">
                      ${hotel.price}/{hotel.currency}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    {[...Array(hotel.star_rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-active fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-primary">
                      {hotel.star_rating} Star Hotel
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {hotel.name}
                  </h3>
                  
                  <div className="flex items-center text-primary mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm text-active">{hotel.location}</span>
                  </div>
                  
                  <p className="text-primary text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link href={`/hotels/${hotel.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </Link>
                    {isAuthenticated ? (
                      <Link href={`/hotels/${hotel.id}`}>
                        <Button size="sm" className="flex-1 bg-active/80 hover:bg-active/90 text-white">
                          Book Now
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        disabled
                        title="Please sign in to book"
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Sign in to Book
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/hotels">
            <Button variant="outline" size="lg">
              View All Hotels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

