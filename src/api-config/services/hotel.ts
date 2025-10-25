import { BookingFormValues } from "@/app/(root)/hotels/schema/hotel-booking";
import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// types/hotel.ts
interface CreatedBy {
  id: string;
  email: string;
  full_name: string;
}

interface UpdatedBy {
  id: string;
  email: string;
  full_name: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  rating: number;
  star_rating: number;
  amenities: string[];
  images: string[];
  has_wifi: boolean;
  has_pool: boolean;
  has_spa: boolean;
  has_gym: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
  has_pet_friendly: boolean;
  phone: string;
  email: string;
  website: string;
  address: string;
  latitude: number;
  longitude: number;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface AllHotels {
  items: Hotel[];
  total: number;
  page: number;
  limit: number;
}

export interface BookHotelResponse {
  id: string;
  customer_name: string;
  customer_email: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  rooms: number;
  special_requests: string;
  status: string;
  hotel_id: string;
  user_id: string;
  created_by_id: string;
  updated_by_id: string | null;
  deleted_by_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  hotel: {
    id: string;
    name: string;
    location: string;
    city: string;
    country: string;
    price: number;
    currency: string;
    rating: number;
    star_rating: number;
  };
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface MyHotelBookings {
  items: BookHotelResponse[];
  total: number;
  page: number;
  limit: number;
}

export function getAllHotelsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllHotels>>(`/hotels?${queryString}`);
}

export function getHotelById(id: string) {
  return apiInstance.get<ApiResponse<Hotel>>(`/hotels/${id}`);
}

export function getFeaturedHotels(limit: number) {
  return apiInstance.get<ApiResponse<AllHotels>>(`/hotels/popular?limit=${limit}`);
}

export function bookHotel(data: BookingFormValues) {
  return apiInstance.post<ApiResponse<BookHotelResponse>>(`/hotel-bookings/`, data);
}

export function getMyHotelBookings() {
  return apiInstance.get<ApiResponse<MyHotelBookings>>(`/hotel-bookings/my-bookings`);
}

export function updateHotelBooking(bookingId: string, data: Partial<BookingFormValues>) {
  return apiInstance.patch<ApiResponse<BookHotelResponse>>(`/hotel-bookings/${bookingId}`, data);
}

export function cancelHotelBooking(bookingId: string) {
  return apiInstance.delete<ApiResponse<{ message: string }>>(`/hotel-bookings/${bookingId}`);
}