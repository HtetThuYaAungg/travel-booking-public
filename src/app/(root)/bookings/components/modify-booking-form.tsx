"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookHotelResponse } from "@/api-config/services/hotel";
import { Shield, Mail } from "lucide-react";
import Modal from "@/components/modal";
import BottomBtns from "@/components/modal_bottom_btns";
import { useAuth } from "@/app/contexts/AuthContext";
import { TextInput } from "@/components/form-inputs/text-input";
import { Form } from "@/components/ui/form";
import { DateInput } from "@/components/form-inputs/date-input";
import bookingFormSchema, {
  BookingFormValues,
} from "../../hotels/schema/hotel-booking";
import { NumberInput } from "@/components/form-inputs/number-input";
import { TextareaInput } from "@/components/form-inputs/text-area-input";
import { useMessage } from "@/app/contexts/MessageContext";
import { useUpdateHotelBooking } from "@/api-config/queries/hotel";

interface ModifyBookingFormProps {
  booking: BookHotelResponse;
  onClose: () => void;
}

export function ModifyBookingForm({ booking, onClose }: ModifyBookingFormProps) {
  const { user, setIsAuthenticated, setUser } = useAuth();
  const message = useMessage();
  const {
    mutateAsync: mutateAsyncUpdateBooking,
    isPending: isPendingUpdateBooking,
  } = useUpdateHotelBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      checkInDate: new Date(booking.check_in_date),
      checkOutDate: new Date(booking.check_out_date),
      guests: booking.guests,
      rooms: booking.rooms,
      specialRequests: booking.special_requests || "",
      hotelId: booking.hotel_id,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;
  const watchedValues = watch();

  // Auto-calculate rooms based on guest count (2:1 ratio - 2 guests per room)
  useEffect(() => {
    const guests = watchedValues.guests;
    if (guests) {
      // Logic: 2 guests per room (2:1 ratio)
      const calculatedRooms = Math.ceil(guests / 2);

      // Only auto-update if the current room count is less than calculated
      // This allows users to manually increase rooms if needed
      if (watchedValues.rooms < calculatedRooms) {
        setValue("rooms", calculatedRooms);
      }
    }
  }, [watchedValues.guests, watchedValues.rooms, setValue]);

  const calculateNights = () => {
    if (watchedValues.checkInDate && watchedValues.checkOutDate) {
      const diffTime =
        watchedValues.checkOutDate.getTime() -
        watchedValues.checkInDate.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * booking.hotel.price * watchedValues.rooms;
  };

  const onSubmit = async (data: BookingFormValues) => {
    const loadingId = message.loading("Updating booking...", 0);
    try {
      await mutateAsyncUpdateBooking({ bookingId: booking.id, data });
      message.remove(loadingId);
      message.success("Booking updated successfully!");
      form.reset();
      onClose();
    } catch (error: any) {
      setIsAuthenticated(false);
      setUser(null);
      message.remove(loadingId);
      message.error(error?.response.data.message || "Update failed!");
    }
  };

  const [checkInDateOpen, setCheckInDateOpen] = useState(false);
  const [checkOutDateOpen, setCheckOutDateOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Modal
      title="Modify Your Booking"
      description="Update your hotel reservation details"
      width="2xl"
      open={true}
      onOpenChange={(open) => !open && onClose()}
      hideDefaultTrigger={true}
      bottomButton={
        <BottomBtns
          formId="modify-booking-form"
          form={form}
          isPending={isPendingUpdateBooking}
          confirmText="Update Booking"
          cancelText="Cancel"
          handleReset={onClose}
        />
      }
    >
      <Form {...form}>
        <form
          id="modify-booking-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Hotel Info */}
          <div
            className=" p-4 rounded-lg"
            style={{ backgroundImage: "url(/logo/hero-bg.png)" }}
          >
            <h3 className="font-semibold text-lg">{booking.hotel.name}</h3>
            <p className="text-primary">{booking.hotel.location}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-active">
                ${booking.hotel.price}
              </span>
              <span className="text-primary">per night</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Customer Name"
                name="customerName"
                placeholder="Enter your full name"
                form={form}
                isCol={true}
                withAsterisk
              />
              <TextInput
                label="Email"
                name="customerEmail"
                placeholder="Enter your email address"
                form={form}
                icon={<Mail className="h-4 w-4" />}
                withAsterisk
                isCol={true}
              />
            </div>
          </div>

          {/* Check-in/Check-out Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              form={form}
              name="checkInDate"
              label="Check-in Date"
              placeholder="Select check-in date"
              dateFormat="dd-MM-yyyy"
              fromDate={today} // Only allow future dates
              dependentField={{
                name: "checkOutDate",
                clearCondition: (selectedDate, checkOutDate) =>
                  checkOutDate <= selectedDate,
              }}
              popoverOpen={checkInDateOpen}
              onPopoverOpenChange={setCheckInDateOpen}
              withAsterisk={true}
              isCol={true}
            />

            <DateInput
              form={form}
              name="checkOutDate"
              label="Check-out Date"
              placeholder="Select check-out date"
              dateFormat="dd-MM-yyyy"
              isCol={true}
              fromDate={tomorrow}
              dependsOn={{
                fieldName: "checkInDate",
                placeholder: "Select start date first",
              }}
              popoverOpen={checkOutDateOpen}
              onPopoverOpenChange={setCheckOutDateOpen}
              withAsterisk={true}
            />
          </div>

          {/* Guests and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput
              form={form}
              name="guests"
              label="Number of Guests"
              withAsterisk={true}
              isCol={true}
              min={1}
              max={10}
              step={1}
              size="sm"
            />

            <div className="flex items-center">
              <NumberInput
                form={form}
                name="rooms"
                label="Number of Rooms"
                withAsterisk={true}
                isCol={true}
                min={1}
                max={5}
                step={1}
                size="sm"
              />
              {watchedValues.guests >= 3 && (
                <p className="text-xs text-active pt-10">
                  ( 2 guests per room )
                </p>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <TextareaInput
            form={form}
            name="specialRequests"
            label="Special Requests"
            placeholder="Any special requests or requirements..."
            withAsterisk={true}
            isCol={true}
          />

          {/* Booking Summary */}
          {watchedValues.checkInDate && watchedValues.checkOutDate && (
            <div
              className=" p-4 rounded-lg space-y-2"
              style={{ backgroundImage: "url(/logo/hero-bg.png)" }}
            >
              <h4 className="font-semibold text-active">Booking Summary</h4>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{calculateNights()}</span>
              </div>
              <div className="flex justify-between">
                <span>Rooms:</span>
                <span>{watchedValues.rooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per night:</span>
                <span>${booking.hotel.price}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-active">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-primary">
            <Shield className="w-4 h-4 text-active" />
            <span>Your booking is secure and encrypted</span>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
