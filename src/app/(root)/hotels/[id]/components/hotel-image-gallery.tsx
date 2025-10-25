"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface HotelImageGalleryProps {
  images: string[];
  hotelName: string;
}

export function HotelImageGallery({ images, hotelName }: HotelImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If no images provided, show placeholder
  const displayImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Card className="overflow-hidden py-0">
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-96 md:h-[500px]">
          <img
            src={displayImages[currentImageIndex]}
            alt={`${hotelName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';
            }}
          />
          
          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${hotelName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={displayImages[currentImageIndex]}
              alt={`${hotelName} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setIsFullscreen(false)}
            >
              ×
            </Button>

            {/* Navigation in Fullscreen */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
