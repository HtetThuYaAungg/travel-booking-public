import { useQuery } from "@tanstack/react-query";
import { hotelKey } from "./key";
import {
  getAllHotelsByFilter,
  getHotelById,
} from "../services/hotel";

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
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

