"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

export function FeaturedHotels() {
  const { isAuthenticated } = useAuth();
  
  const featuredHotels = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      price: 250,
      rating: 5,
      location: "Downtown, Yangon",
      description: "Luxurious 5-star hotel in the heart of the city with stunning views and world-class amenities.",
      image: "/api/placeholder/400/300",
      stars: 5,
    },
    {
      id: 2,
      name: "Riverside Resort",
      price: 180,
      rating: 4,
      location: "Riverside, Mandalay",
      description: "Peaceful riverside retreat with beautiful gardens and spa facilities.",
      image: "/api/placeholder/400/300",
      stars: 4,
    },
    {
      id: 3,
      name: "Beach Paradise Resort",
      price: 320,
      rating: 5,
      location: "Ngapali Beach",
      description: "Tropical beachfront resort with pristine white sand beaches and crystal clear waters.",
      image: "/api/placeholder/400/300",
      stars: 5,
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Hotel Image</span>
                </div>
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-900">
                    ${hotel.price}/USD
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-primary">
                    {hotel.stars} Star Hotel
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {hotel.name}
                </h3>
                
                <div className="flex items-center text-primary mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                
                <p className="text-primary text-sm mb-4 line-clamp-2">
                  {hotel.description}
                </p>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {isAuthenticated ? (
                    <Button size="sm" className="flex-1">
                      Book Now
                    </Button>
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

