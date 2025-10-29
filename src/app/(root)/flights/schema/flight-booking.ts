import { z } from "zod";

export const passengerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  age: z.number().min(0, "Age must be positive").max(120, "Invalid age"),
  type: z.enum(["adult", "child", "infant"], {
    required_error: "Passenger type is required",
  }),
  seat_preference: z.string().optional(),
  meal_preference: z.string().optional(),
  special_requests: z.string().optional(),
});

export const flightBookingSchema = z
  .object({
    flight_id: z.string().min(1, "Flight ID is required"),
    customer_name: z.string().min(1, "Customer name is required"),
    customer_email: z.string().email("Please enter a valid email address"),
    customer_phone: z.string().min(1, "Phone number is required"),
    passengers: z.array(passengerSchema).min(1, "At least 1 passenger required").max(9, "Maximum 9 passengers allowed"),
    departure_date: z.date({
      required_error: "Departure date is required",
    }),
    return_date: z.date().optional(),
    base_price: z.number().min(0, "Base price must be positive"),
    taxes_fees: z.number().min(0, "Taxes and fees must be positive").default(0),
    discounts: z.number().min(0, "Discounts must be positive").default(0),
    currency: z.string().default("USD"),
    seat_preferences: z.array(z.string()).optional(),
    meal_preferences: z.array(z.string()).optional(),
    special_requests: z.string().optional(),
    payment_status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).default("PENDING"),
  })
  .refine(
    (data) => {
      if (data.departure_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.departure_date >= today;
      }
      return true;
    },
    {
      message: "Departure date must be today or in the future",
      path: ["departure_date"],
    }
  )
  .refine(
    (data) => {
      if (data.departure_date && data.return_date) {
        return data.return_date > data.departure_date;
      }
      return true;
    },
    {
      message: "Return date must be after departure date",
      path: ["return_date"],
    }
  );

export type FlightBookingValues = z.infer<typeof flightBookingSchema>;
export type PassengerValues = z.infer<typeof passengerSchema>;

export default flightBookingSchema;
