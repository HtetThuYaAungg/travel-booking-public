import { z } from "zod";

export const bookingFormSchema = z
  .object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Please enter a valid email address"),
    checkInDate: z.date({
      required_error: "Start date is required",
    }),
    checkOutDate: z.date().optional(),
    guests: z
      .number()
      .min(1, "At least 1 guest is required")
      .max(10, "Maximum 10 guests allowed"),
    rooms: z
      .number()
      .min(1, "At least 1 room is required")
      .max(5, "Maximum 5 rooms allowed"),
    specialRequests: z.string().optional(),
    hotelId: z.string().min(1, "Hotel ID is required"),
  })
  .refine(
    (data) => {
      if (data.checkInDate && !data.checkOutDate) {
        return false;
      }
      return true;
    },
    {
      message: "Check-out date is required",
      path: ["checkOutDate"],
    }
  )
  .refine(
    (data) => {
      if (data.checkInDate && data.checkOutDate) {
        return data.checkOutDate > data.checkInDate;
      }
      return true;
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDate"],
    }
  )
  .refine(
    (data) => {
      if (data.checkOutDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.checkOutDate > today;
      }
      return true;
    },
    {
      message: "Check-out date must be greater than today",
      path: ["checkOutDate"],
    }
  )
  .refine(
    (data) => {
      // Validate room-guest relationship (2:1 ratio - 2 guests per room)
      const minRooms = Math.ceil(data.guests / 2);
      return data.rooms >= minRooms;
    },
    {
      message: "Not enough rooms for the number of guests. Please add more rooms.",
      path: ["rooms"],
    }
  );

export type BookingFormValues = z.infer<
  typeof bookingFormSchema
>;

export default bookingFormSchema; 
