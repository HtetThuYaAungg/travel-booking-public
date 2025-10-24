"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect
            <span className="block text-yellow-400">Travel Experience</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing hotels, flights, and buses for your next adventure
          </p>
          

        </div>
      </div>
    </div>
  );
}

