

export const permissionKey = {
  all: ["permission"] as const,
  userPermission: ["user-permission"] as const,
  detail: (id: string | null) => [...permissionKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...permissionKey.all, "list", ...Object.values(filters)] as const,
};

export const hotelKey = {
  all: ["hotel"] as const,
  detail: (id: string | null) => [...hotelKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...hotelKey.all, "list", ...Object.values(filters)] as const,
  popular: (limit: number) => [...hotelKey.all, "popular", limit] as const,
  booking_list: ["booking-list"] as const,
};