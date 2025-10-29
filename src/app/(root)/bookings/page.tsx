"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, User, Plane, Bus, Hotel } from "lucide-react";
import { useGetMyHotelBookings, useCancelHotelBooking } from "@/api-config/queries/hotel";
import { useGetMyFlightBookings, useCancelFlightBooking } from "@/api-config/queries/flight";
import { Skeleton } from "@/components/ui/skeleton";
import { BookHotelResponse } from "@/api-config/services/hotel";
import { BookFlightResponse } from "@/api-config/services/flight";
import { format } from "date-fns";
import { ModifyBookingForm } from "./components/modify-booking-form";
import { useMessage } from "@/app/contexts/MessageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("hotel");
  const [modifyBooking, setModifyBooking] = useState<BookHotelResponse | null>(null);
  const [cancelBooking, setCancelBooking] = useState<BookHotelResponse | null>(null);
  const [cancelFlightBooking, setCancelFlightBooking] = useState<BookFlightResponse | null>(null);
  const router = useRouter();
  
  // Fetch hotel bookings
  const { data: hotelBookings, isLoading: isLoadingHotels, error: hotelError } = useGetMyHotelBookings();
  
  // Fetch flight bookings
  const { data: flightBookings, isLoading: isLoadingFlights, error: flightError } = useGetMyFlightBookings();
  
  // Cancel booking mutations
  const { mutateAsync: cancelHotelBookingMutation, isPending: isCancelingHotel } = useCancelHotelBooking();
  const { mutateAsync: cancelFlightBookingMutation, isPending: isCancelingFlight } = useCancelFlightBooking();
  const message = useMessage();

  const handleCancelHotelBooking = async () => {
    if (!cancelBooking) return;
    
    const loadingId = message.loading("Canceling booking...", 0);
    try {
      await cancelHotelBookingMutation(cancelBooking.id);
      message.remove(loadingId);
      message.success("Hotel booking canceled successfully!");
      setCancelBooking(null);
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response?.data?.message || "Failed to cancel booking!");
    }
  };

  const handleCancelFlightBooking = async () => {
    if (!cancelFlightBooking) return;
    
    const loadingId = message.loading("Canceling flight booking...", 0);
    try {
      await cancelFlightBookingMutation(cancelFlightBooking.id);
      message.remove(loadingId);
      message.success("Flight booking canceled successfully!");
      setCancelFlightBooking(null);
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response?.data?.message || "Failed to cancel flight booking!");
    }
  };

  const tabs = [
    { id: "hotel", label: "Hotels", icon: Hotel },
    { id: "flight", label: "Flights", icon: Plane },
    { id: "bus", label: "Buses", icon: Bus },
  ];

  const renderHotelBookings = () => {
    if (isLoadingHotels) {
      return (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (hotelError) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Error Loading Bookings
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            There was an error loading your hotel bookings. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      );
    }

    if (!hotelBookings || !hotelBookings.data || hotelBookings.data.items.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hotel className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-primary/50 mb-4">
            No Hotel Bookings Yet
          </h2>
          <p className="text-lg text-primary/50 mb-8">
            Start planning your next trip by booking a hotel.
          </p>
          <Button className="bg-active hover:bg-active/80" onClick={() => router.push("/hotels")}>
            Book Hotel
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {hotelBookings.data.items.map((booking: BookHotelResponse) => (
          <Card
            key={booking.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Hotel Booking</CardTitle>
                  <p className="text-primary/50">Booking ID: {booking.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-active">
                    $
                    {(booking.rooms *
                      booking.hotel.price *
                      (new Date(booking.check_out_date).getTime() -
                        new Date(booking.check_in_date).getTime())) /
                      86400000}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-start text-primary/50">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Hotel Location</span>
                  </div>
                  <span>
                    {booking.hotel.location}, {booking.hotel.city},{" "}
                    {booking.hotel.country}
                  </span>
                </div>
                <div className="flex items-center text-primary/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(booking.check_in_date), "dd/MM/yyyy")} -{" "}
                    {format(new Date(booking.check_out_date), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-primary/50">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-primary/50">
                  <strong>Customer:</strong> {booking.customer_name} (
                  {booking.customer_email})
                </p>
                <p className="text-sm text-primary/50">
                  <strong>Rooms:</strong> {booking.rooms}
                </p>
                {booking.special_requests && (
                  <p className="text-sm text-primary/50">
                    <strong>Special Requests:</strong>{" "}
                    {booking.special_requests}
                  </p>
                )}
              </div>

              <div className="flex float-end space-x-3 w-1/2 ">
                {booking.status === "PENDING" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setModifyBooking(booking)}
                  >
                    Modify Booking
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelBooking(booking)}
                  disabled={isCancelingHotel}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderFlightBookings = () => {
    if (isLoadingFlights) {
      return (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex space-x-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (flightError) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Error Loading Flight Bookings
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            There was an error loading your flight bookings. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      );
    }

    if (!flightBookings || !flightBookings.data || !flightBookings.data.items || flightBookings.data.items.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-primary/50 mb-4">
            No Flight Bookings Yet
          </h2>
          <p className="text-lg text-primary/50 mb-8">
            Start planning your next trip by booking a flight.
          </p>
          <Button 
            className="bg-active hover:bg-active/80"
            onClick={() => router.push("/flights")}
          >
            Book Flight
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {flightBookings.data.items.map((booking: BookFlightResponse) => (
          <Card
            key={booking.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Flight Booking</CardTitle>
                  <p className="text-primary/50">Booking ID: {booking.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-active">
                    ${booking.total_price}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-start text-primary/50">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Route</span>
                  </div>
                  <span>
                    {booking.flight.departure_airport_code} → {booking.flight.arrival_airport_code}
                  </span>
                  <span className="text-sm">
                    {booking.flight.departure_city} → {booking.flight.arrival_city}
                  </span>
                </div>
                <div className="flex items-center text-primary/50">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(booking.departure_date), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-primary/50">
                  <User className="w-4 h-4 mr-2" />
                  <span>
                    {booking.passengers.length} passenger{booking.passengers.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-primary/50">
                  <strong>Passenger:</strong> {booking.customer_name} ({booking.customer_email})
                </p>
                <p className="text-sm text-primary/50">
                  <strong>Flight:</strong> {booking.flight.airline_name} {booking.flight.flight_number}
                </p>
                <p className="text-sm text-primary/50">
                  <strong>Class:</strong> {booking.flight.class_type}
                </p>
                <p className="text-sm text-primary/50">
                  <strong>Departure:</strong> {format(new Date(booking.departure_date), "dd/MM/yyyy")}
                </p>
                {/* <p className="text-sm text-primary/50">
                  <strong>Arrival:</strong> {format(new Date(booking.return_date), "dd/MM/yyyy")}
                </p> */}
                {booking.special_requests && (
                  <p className="text-sm text-primary/50">
                    <strong>Special Requests:</strong> {booking.special_requests}
                  </p>
                )}
              </div>

              <div className="flex float-end space-x-3 w-1/2">
                {booking.status === "PENDING" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implement flight booking modification
                      message.info("Flight booking modification coming soon!");
                    }}
                  >
                    Modify Booking
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCancelFlightBooking(booking)}
                  disabled={isCancelingFlight}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderBusBookings = () => {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bus className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-primary/50 mb-4">
          No Bus Bookings Yet
        </h2>
        <p className="text-lg text-primary/50 mb-8">
          Start planning your next trip by booking a bus.
        </p>
        <Button className="bg-active hover:bg-active/80">
          Book Bus
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "hotel":
        return renderHotelBookings();
      case "flight":
        return renderFlightBookings();
      case "bus":
        return renderBusBookings();
      default:
        return renderHotelBookings();
    }
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
          <h1 className="text-4xl font-bold mb-4 text-active">My Bookings</h1>
          <p className="text-xl text-primary">
            Manage your travel bookings and reservations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-active text-active"
                        : "border-transparent text-primary hover:text-active/50 hover:border-active"
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Modify Booking Modal */}
      {modifyBooking && (
        <ModifyBookingForm
          booking={modifyBooking}
          onClose={() => setModifyBooking(null)}
        />
      )}

      {/* Cancel Hotel Booking Confirmation Dialog */}
      <AlertDialog open={!!cancelBooking} onOpenChange={() => setCancelBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Hotel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this hotel booking? This action cannot be undone.
              {cancelBooking && (
                <div className="mt-4 p-4 text-primary/70 rounded-lg" style={{ backgroundImage: "url(/logo/hero-bg.png)" }}>
                  <div className="flex items-center justify-between"><strong>Hotel:</strong> {cancelBooking.hotel.name}</div>
                  <div className="flex items-center justify-between"><strong>Booking ID:</strong> {cancelBooking.id}</div>
                  <div className="flex items-center justify-between"><strong>Dates:</strong> {format(new Date(cancelBooking.check_in_date), "dd/MM/yyyy")} - {format(new Date(cancelBooking.check_out_date), "dd/MM/yyyy")}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelingHotel}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelHotelBooking}
              disabled={isCancelingHotel}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelingHotel ? "Canceling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Flight Booking Confirmation Dialog */}
      <AlertDialog open={!!cancelFlightBooking} onOpenChange={() => setCancelFlightBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Flight Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this flight booking? This action cannot be undone.
              {cancelFlightBooking && (
                <div className="mt-4 p-4 text-primary/70 rounded-lg" style={{ backgroundImage: "url(/logo/hero-bg.png)" }}>
                  <div className="flex items-center justify-between"><strong>Flight:</strong> {cancelFlightBooking.flight.airline_name} {cancelFlightBooking.flight.flight_number}</div>
                  <div className="flex items-center justify-between"><strong>Booking ID:</strong> {cancelFlightBooking.id}</div>
                  <div className="flex items-center justify-between"><strong>Route:</strong> {cancelFlightBooking.flight.departure_airport_code} → {cancelFlightBooking.flight.arrival_airport_code}</div>
                  <div className="flex items-center justify-between"><strong>Date:</strong> {format(new Date(cancelFlightBooking.departure_date), "dd/MM/yyyy")}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelingFlight}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelFlightBooking}
              disabled={isCancelingFlight}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelingFlight ? "Canceling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

