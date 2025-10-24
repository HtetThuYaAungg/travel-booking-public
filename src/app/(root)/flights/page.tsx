"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Calendar, Users, Search } from "lucide-react";

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl text-green-100">
            Book flights to destinations around the world
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="From"
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="To"
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    placeholder="Departure Date"
                    className="pl-10"
                  />
                </div>
                
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Flight Booking Coming Soon
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're working on bringing you the best flight booking experience. Stay tuned!
          </p>
          <Button variant="outline" size="lg">
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  );
}

