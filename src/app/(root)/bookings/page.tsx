"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, User } from "lucide-react";

export default function BookingsPage() {
  const bookings = [
    {
      id: "BK001",
      type: "Hotel",
      name: "Grand Palace Hotel",
      location: "Downtown, Yangon",
      checkIn: "2025-01-15",
      checkOut: "2025-01-18",
      guests: 2,
      status: "Confirmed",
      total: 750,
    },
    {
      id: "BK002",
      type: "Hotel",
      name: "Riverside Resort",
      location: "Riverside, Mandalay",
      checkIn: "2025-02-10",
      checkOut: "2025-02-12",
      guests: 1,
      status: "Pending",
      total: 360,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-xl text-blue-100">
            Manage your travel bookings and reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.name}</CardTitle>
                      <p className="text-gray-600">Booking ID: {booking.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${booking.total}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{booking.checkIn} - {booking.checkOut}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Modify Booking
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Bookings Yet
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start planning your next trip by booking a hotel, flight, or bus.
            </p>
            <div className="space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book Hotel
              </Button>
              <Button variant="outline">
                Book Flight
              </Button>
              <Button variant="outline">
                Book Bus
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

