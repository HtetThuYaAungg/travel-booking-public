export const hotelKey = {
  all: ["hotels"] as const,
  filters: (filters: Record<string, any>) => [...hotelKey.all, "filters", filters] as const,
  detail: (id: string | null) => [...hotelKey.all, "detail", id] as const,
  popular: (limit: number) => [...hotelKey.all, "popular", limit] as const,
  booking_list: ["hotel-bookings"] as const,
};

export const flightKey = {
  all: ["flights"] as const,
  filters: (filters: Record<string, any>) => [...flightKey.all, "filters", filters] as const,
  detail: (id: string | null) => [...flightKey.all, "detail", id] as const,
  popular: (limit: number) => [...flightKey.all, "popular", limit] as const,
  booking_list: ["flight-bookings"] as const,
};