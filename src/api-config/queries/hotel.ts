import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hotelKey } from "./key";
import {
  getAllHotelsByFilter,
  getHotelById,
  getFeaturedHotels,
  bookHotel,
  getMyHotelBookings,
  updateHotelBooking,
  cancelHotelBooking,
} from "../services/hotel";
import { BookingFormValues } from "@/app/(root)/hotels/schema/hotel-booking";

export function useGetAllHotelsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: hotelKey.filters(filters || {}),
    queryFn: () => getAllHotelsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetHotelById(id: string | null) {
  return useQuery({
    queryKey: hotelKey.detail(id),
    queryFn: () => {
      if (id) return getHotelById(id);
    },
    select: (data) => data?.data.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetFeaturedHotels(limit: number) {
  return useQuery({
    queryKey: hotelKey.popular(limit),
    queryFn: () => getFeaturedHotels(limit),
    select: (data) => data?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}


export function useCreateBookHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BookingFormValues) => bookHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.booking_list });
    },
  });
}

export function useGetMyHotelBookings() {
  return useQuery({
    queryKey: hotelKey.booking_list,
    queryFn: () => getMyHotelBookings(),
    select: (data) => data?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useUpdateHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: Partial<BookingFormValues> }) => 
      updateHotelBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.booking_list });
    },
  });
}

export function useCancelHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelHotelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.booking_list });
    },
  });
}
