import * as z from "zod";

export const flightFilterSchema = z.object({
  search: z.string().optional(),
  departure_airport_code: z.string().optional(),
  arrival_airport_code: z.string().optional(),
  departure_city: z.string().optional(),
  arrival_city: z.string().optional(),
  departure_country: z.string().optional(),
  arrival_country: z.string().optional(),
  departure_date: z.string().optional(),
  arrival_date: z.string().optional(),
  min_available_seats: z.number().min(1).max(9).optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  airline_name: z.string().optional(),
  airline_code: z.string().optional(),
  aircraft_type: z.string().optional(),
  class_type: z.string().optional(),
  has_wifi: z.boolean().optional(),
  has_meal: z.boolean().optional(),
  has_entertainment: z.boolean().optional(),
  has_luggage: z.boolean().optional(),
  is_domestic: z.boolean().optional(),
  min_duration: z.number().optional(),
  max_duration: z.number().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type FlightFilterValues = z.infer<typeof flightFilterSchema>;

export default flightFilterSchema;
