import { FlightBookingValues } from "@/app/(root)/flights/schema/flight-booking";
import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// Flight interface based on the provided data structure
export interface Flight {
  id: string;
  flight_number: string;
  airline_name: string;
  airline_code: string;
  aircraft_type: string;
  departure_airport_code: string;
  departure_airport_name: string;
  departure_city: string;
  departure_country: string;
  arrival_airport_code: string;
  arrival_airport_name: string;
  arrival_city: string;
  arrival_country: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  base_price: number;
  currency: string;
  available_seats: number;
  total_seats: number;
  class_type: string;
  has_wifi: boolean;
  has_meal: boolean;
  has_entertainment: boolean;
  has_luggage: boolean;
  status: string;
  is_domestic: boolean;
  created_at: string;
  updated_at: string;
  duration_formatted: string;
  route: string;
  departure_time_formatted: string;
  arrival_time_formatted: string;
}

interface AllFlights {
  items: Flight[];
  total: number;
  page: number;
  limit: number;
}

export interface Passenger {
  full_name: string;
  age: number;
  type: "adult" | "child" | "infant";
  seat_preference: string;
  meal_preference: string;
  special_requests: string;
}

export interface BookFlightResponse {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  departure_date: string;
  return_date: string;
  total_price: number;
  currency: string;
  taxes_fees: number;
  discounts: number;
  base_price: number;
  passengers: Passenger[];
  class_type: string;
  special_requests: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  flight_id: string;
  user_id: string;
  created_by_id: string;
  updated_by_id: string | null;
  deleted_by_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  flight: {
    id: string;
    flight_number: string;
    airline_name: string;
    airline_code: string;
    aircraft_type: string;
    departure_airport_code: string;
    departure_airport_name: string;
    departure_city: string;
    departure_country: string;
    arrival_airport_code: string;
    arrival_airport_name: string;
    arrival_city: string;
    arrival_country: string;
    departure_time: string;
    arrival_time: string;
    duration_minutes: number;
    base_price: number;
    currency: string;
    class_type: string;
    route: string;
    departure_time_formatted: string;
    arrival_time_formatted: string;
  };
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface MyFlightBookings {
  items: BookFlightResponse[];
  total: number;
  page: number;
  limit: number;
}

export function getAllFlightsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllFlights>>(`/flights?${queryString}`);
}

export function getFlightById(id: string) {
  return apiInstance.get<ApiResponse<Flight>>(`/flights/${id}`);
}

export function getFeaturedFlights(limit: number) {
  return apiInstance.get<ApiResponse<AllFlights>>(`/flights/popular?limit=${limit}`);
}

export function bookFlight(data: FlightBookingValues) {
  return apiInstance.post<ApiResponse<BookFlightResponse>>(`/flight-bookings/`, data);
}

export function getMyFlightBookings() {
  return apiInstance.get<ApiResponse<MyFlightBookings>>(`/flight-bookings/my-bookings`);
}

export function updateFlightBooking(bookingId: string, data: Partial<FlightBookingValues>) {
  return apiInstance.patch<ApiResponse<BookFlightResponse>>(`/flight-bookings/${bookingId}`, data);
}

export function cancelFlightBooking(bookingId: string) {
  return apiInstance.delete<ApiResponse<{ message: string }>>(`/flight-bookings/${bookingId}`);
}
