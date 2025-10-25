"use client";

import React, { useState } from "react";
import { Hotel } from "@/api-config/services/hotel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Wifi, 
  Car, 
  Utensils, 
  Dumbbell, 
  Waves, 
  
  Heart,
  Share2,
  Calendar,
  Users,
  Clock,
  Shield,
  CreditCard,
  ArrowLeft,
  WandSparkles
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { HotelImageGallery } from "./hotel-image-gallery";
import { HotelBookingForm } from "./hotel-booking-form";


interface HotelDetailProps {
  hotel: Hotel;
}

export function HotelDetail({ hotel }: HotelDetailProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const amenities = [
    {
      key: "has_wifi",
      label: "Free WiFi",
      icon: Wifi,
      enabled: hotel.has_wifi,
    },
    {
      key: "has_parking",
      label: "Free Parking",
      icon: Car,
      enabled: hotel.has_parking,
    },
    {
      key: "has_restaurant",
      label: "Restaurant",
      icon: Utensils,
      enabled: hotel.has_restaurant,
    },
    {
      key: "has_gym",
      label: "Fitness Center",
      icon: Dumbbell,
      enabled: hotel.has_gym,
    },
    {
      key: "has_pool",
      label: "Swimming Pool",
      icon: Waves,
      enabled: hotel.has_pool,
    },
    {
      key: "has_spa",
      label: "Spa Services",
      icon: WandSparkles,
      enabled: hotel.has_spa,
    },
    {
      key: "has_pet_friendly",
      label: "Pet Friendly",
      icon: Heart,
      enabled: hotel.has_pet_friendly,
    },
  ];

  const enabledAmenities = amenities.filter(amenity => amenity.enabled);

  const handleBookNow = () => {
    if (isAuthenticated) {
      setShowBookingForm(true);
    } else {
      // Redirect to login or show login modal
      router.push('/auth/login');
    }
  };

  const handleBackToList = () => {
    router.push('/hotels');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToList}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hotels</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Images */}
            <HotelImageGallery images={hotel.images} hotelName={hotel.name} />

            {/* Hotel Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(hotel.star_rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-active fill-current"
                        />
                      ))}
                      <span className="ml-2 text-sm text-primary">
                        {hotel.star_rating} Star Hotel
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      {hotel.name}
                    </h1>
                    <div className="flex items-center text-primary mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{hotel.location}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-active fill-current mr-1" />
                        <span className="font-semibold">{hotel.rating}</span>
                        <span className="text-primary ml-1">/ 5</span>
                      </div>
                      <Badge variant="secondary">Excellent</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-active">
                      ${hotel.price}
                    </div>
                    <div className="text-sm text-primary">per night</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-primary leading-relaxed">
                  {hotel.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Hotel Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {enabledAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={amenity.key} className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-active" />
                        <span className="text-sm text-primary">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{hotel.email}</span>
                    </div>
                  )}
                  {hotel.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <a 
                        href={hotel.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-active hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{hotel.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${hotel.price}
                  </div>
                  <div className="text-sm text-primary">per night</div>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 text-active fill-current mr-1" />
                    <span className="font-semibold">{hotel.rating}</span>
                    <span className="text-primary ml-1">/ 5</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-active/80 hover:bg-active text-white"
                  size="lg"
                >
                  {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
                </Button>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">Check-in</span>
                    <span className="font-medium">3:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">Check-out</span>
                    <span className="font-medium">11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">Cancellation</span>
                    <span className="font-medium text-active">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-primary">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Secure booking</span>
                  </div>
                  <div className="flex items-center text-sm text-primary">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Best price guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <HotelBookingForm 
          hotel={hotel}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}
