import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flightKey } from "./key";
import {
  getAllFlightsByFilter,
  getFlightById,
  getFeaturedFlights,
  bookFlight,
  getMyFlightBookings,
  updateFlightBooking,
  cancelFlightBooking,
} from "../services/flight";
import { FlightBookingValues } from "@/app/(root)/flights/schema/flight-booking";

export function useGetAllFlightsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: flightKey.filters(filters || {}),
    queryFn: () => getAllFlightsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetFlightById(id: string | null) {
  return useQuery({
    queryKey: flightKey.detail(id),
    queryFn: () => {
      if (id) return getFlightById(id);
    },
    select: (data) => data?.data.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetFeaturedFlights(limit: number) {
  return useQuery({
    queryKey: flightKey.popular(limit),
    queryFn: () => getFeaturedFlights(limit),
    select: (data) => data?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateBookFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FlightBookingValues) => bookFlight(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.filters({}) });
    },
  });
}

export function useGetMyFlightBookings() {
  return useQuery({
    queryKey: flightKey.booking_list,
    queryFn: () => getMyFlightBookings(),
    select: (data) => data?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useUpdateFlightBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: Partial<FlightBookingValues> }) => 
      updateFlightBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.booking_list });
    },
  });
}

export function useCancelFlightBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelFlightBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.booking_list });
    },
  });
}
