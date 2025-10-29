"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetFlightById } from "@/api-config/queries/flight";
import { useCreateBookFlight } from "@/api-config/queries/flight";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plane,
  Clock,
  Users,
  Wifi,
  Utensils,
  Headphones,
  Luggage,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Plus,
  Trash2,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useMessage } from "@/app/contexts/MessageContext";
import FetchErrorAlert from "@/components/fetch-error-alert";
import flightBookingSchema, {
  FlightBookingValues,
  PassengerValues,
} from "../schema/flight-booking";
import { TextInput } from "@/components/form-inputs/text-input";
import { DateInput } from "@/components/form-inputs/date-input";
import { NumberInput } from "@/components/form-inputs/number-input";
import { TextareaInput } from "@/components/form-inputs/text-area-input";

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const message = useMessage();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [departureDateOpen, setDepartureDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  const flightId = params.id as string;

  const {
    data: flight,
    isLoading: isFlightLoading,
    error: flightError,
  } = useGetFlightById(flightId);

  const {
    mutateAsync: mutateAsyncCreateBookFlight,
    isPending: isPendingCreateBookFlight,
  } = useCreateBookFlight();

  const form = useForm({
    resolver: zodResolver(flightBookingSchema),
    defaultValues: {
      flight_id: flightId,
      customer_name: user?.name || "",
      customer_email: user?.email || "",
      customer_phone: "",
      passengers: [
        {
          full_name: "",
          age: 18,
          type: "adult" as const,
          seat_preference: "",
          meal_preference: "",
          special_requests: "",
        },
      ],
      departure_date: undefined as Date | undefined,
      return_date: undefined as Date | undefined,
      base_price: 0,
      taxes_fees: 0,
      discounts: 0,
      currency: "USD",
      seat_preferences: [],
      meal_preferences: [],
      special_requests: "",
      payment_status: "PENDING" as const,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  const watchedValues = watch();

  // Update form when flight data loads
  useEffect(() => {
    if (flight) {
      setValue("flight_id", flight.id);
      setValue("base_price", flight.base_price);
      setValue("currency", flight.currency);
    }
  }, [flight, setValue]);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setValue("customer_name", user.name || "");
      setValue("customer_email", user.email || "");
    }
  }, [user, setValue]);

  const addPassenger = () => {
    if (fields.length < 9) {
      append({
        full_name: "",
        age: 18,
        type: "adult",
        seat_preference: "",
        meal_preference: "",
        special_requests: "",
      });
    }
  };

  const removePassenger = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    return watchedValues.base_price * watchedValues.passengers.length;
  };

  const onSubmit = async (data: any) => {
    if (!isAuthenticated) {
      message.error("Please sign in to book a flight");
      return;
    }

    const loadingId = message.loading("Booking...", 0);
    try {
      await mutateAsyncCreateBookFlight({
        ...data,
        taxes_fees: 0,
        discounts: 0,
      });
      message.remove(loadingId);
      message.success("Flight booked successfully!");
      setBookingSuccess(true);
    } catch (error: any) {
      message.remove(loadingId);
      message.error(
        error?.response?.data?.message ||
          "Failed to book flight. Please try again."
      );
    }
  };

  if (flightError) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load flight details. Please try again."
      />
    );
  }

  if (isFlightLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-active" />
        <span className="ml-2 text-primary">Loading flight details...</span>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Flight Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The flight you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/flights")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your flight has been successfully booked. You will receive a
              confirmation email shortly.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/bookings")}
                className="w-full"
              >
                View My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/flights")}
                className="w-full"
              >
                Book Another Flight
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="outline"
            onClick={() => router.push("/flights")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flights
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Flight Details */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {flight.airline_name}
                </CardTitle>
                <p className="text-gray-600">
                  {flight.flight_number} • {flight.aircraft_type}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Flight Route */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {flight.departure_time_formatted}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.departure_airport_code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure_city}, {flight.departure_country}
                    </div>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="mx-4 flex flex-col items-center">
                        <Plane className="w-6 h-6 text-gray-400 rotate-90 mb-1" />
                        <div className="text-sm text-gray-500">
                          {flight.duration_formatted}
                        </div>
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {flight.arrival_time_formatted}
                    </div>
                    <div className="text-sm text-gray-600">
                      {flight.arrival_airport_code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival_city}, {flight.arrival_country}
                    </div>
                  </div>
                </div>

                {/* Flight Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Flight Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span>{flight.route}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{flight.duration_formatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Class:</span>
                        <span>{flight.class_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Seats:</span>
                        <span>{flight.available_seats}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Amenities
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Wifi
                          className={`w-4 h-4 mr-2 ${
                            flight.has_wifi ? "text-green-500" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            flight.has_wifi ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          WiFi
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Utensils
                          className={`w-4 h-4 mr-2 ${
                            flight.has_meal ? "text-green-500" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            flight.has_meal ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          Meal
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Headphones
                          className={`w-4 h-4 mr-2 ${
                            flight.has_entertainment
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            flight.has_entertainment
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          Entertainment
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Luggage
                          className={`w-4 h-4 mr-2 ${
                            flight.has_luggage
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            flight.has_luggage
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          Luggage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book This Flight</CardTitle>
                <div className="text-2xl font-bold text-active">
                  ${flight.base_price} {flight.currency}
                </div>
                <p className="text-sm text-primary/50">
                  {flight.available_seats} seats left
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">
                        Customer Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          label="Customer Name"
                          name="customer_name"
                          placeholder="Enter your full name"
                          form={form}
                          isCol={true}
                          withAsterisk
                        />
                        <TextInput
                          label="Email"
                          name="customer_email"
                          placeholder="Enter your email address"
                          form={form}
                          isCol={true}
                          withAsterisk
                        />
                        <TextInput
                          label="Phone Number"
                          name="customer_phone"
                          placeholder="Enter your phone number"
                          form={form}
                          isCol={true}
                          withAsterisk
                        />
                      </div>
                    </div>

                    {/* Travel Dates */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">
                        Travel Dates
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateInput
                          label="Departure Date"
                          name="departure_date"
                          form={form}
                          isCol={true}
                          withAsterisk
                        />
                        <DateInput
                          label="Return Date"
                          name="return_date"
                          form={form}
                          isCol={true}
                        />
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary">
                          Passengers
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPassenger}
                          disabled={fields.length >= 9}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Passenger
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-primary">
                              Passenger {index + 1}
                            </h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePassenger(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <FormField
                              control={form.control}
                              name={`passengers.${index}.full_name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}
                            <TextInput
                              label="Full Name"
                              name={`passengers.${index}.full_name`}
                              placeholder="Enter full name"
                              form={form}
                              isCol={true}
                              withAsterisk
                            />
                            <NumberInput
                              label="Age"
                              name={`passengers.${index}.age`}
                              form={form}
                              isCol={true}
                              withAsterisk
                            />

                            <FormField
                              control={form.control}
                              name={`passengers.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Passenger Type *</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="adult">
                                        Adult (12+)
                                      </SelectItem>
                                      <SelectItem value="child">
                                        Child (2-11)
                                      </SelectItem>
                                      <SelectItem value="infant">
                                        Infant (0-1)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <TextInput
                              label="Seat Preference"
                              name={`passengers.${index}.seat_preference`}
                              placeholder="Enter seat preference"
                              form={form}
                              isCol={true}
                              withAsterisk
                            />

                            <TextInput
                              label="Meal Preference"
                              name={`passengers.${index}.meal_preference`}
                              placeholder="Enter meal preference"
                              form={form}
                              isCol={true}
                              withAsterisk
                            />
                            <TextareaInput
                              label="Special Requests"
                              name={`passengers.${index}.special_requests`}
                              placeholder="Enter special requests"
                              form={form}
                              isCol={true}
                              withAsterisk
                            />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Pricing Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">
                        Pricing
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="base_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Passengers
                          </label>
                          <Input
                            readOnly
                            value={watchedValues.passengers.length}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Price
                          </label>
                          <Input
                            readOnly
                            value={`${calculateTotal().toFixed(2)} ${
                              watchedValues.currency
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* General Special Requests */}
                    <FormField
                      control={form.control}
                      name="special_requests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            General Special Requests (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any general special requests or notes..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Shield className="w-4 h-4 text-active" />
                      <span>Your booking is secure and encrypted</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-active/80 hover:bg-active text-white"
                      disabled={isPendingCreateBookFlight || !isAuthenticated}
                    >
                      {isPendingCreateBookFlight ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : !isAuthenticated ? (
                        "Sign in to Book"
                      ) : (
                        "Book Flight"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
