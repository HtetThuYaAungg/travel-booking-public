"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plane, 
  Calendar, 
  Users, 
  DollarSign, 
  Wifi, 
  Utensils, 
  Headphones, 
  Luggage,
  Clock
} from "lucide-react";
import { useState } from "react";
import flightFilterSchema, { FlightFilterValues } from "../schema/filter-flight";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

interface FlightFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function FlightFilters({ filter, setFilter }: FlightFilterProps) {
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const form = useForm<FlightFilterValues>({
    resolver: zodResolver(flightFilterSchema),
    defaultValues: {
      search: "",
      departure_airport_code: "",
      arrival_airport_code: "",
      departure_city: "",
      arrival_city: "",
      departure_country: "",
      arrival_country: "",
      departure_date: "",
      arrival_date: "",
      min_available_seats: 1,
      min_price: undefined,
      max_price: undefined,
      airline_name: "",
      airline_code: "",
      aircraft_type: "",
      class_type: "",
      has_wifi: false,
      has_meal: false,
      has_entertainment: false,
      has_luggage: false,
      is_domestic: undefined,
      min_duration: undefined,
      max_duration: undefined,
      sort_by: "",
      sort_order: "asc",
      page: defaultPageNo,
      limit: defaultPageSize,
    },
  });

  const onSubmit = (data: FlightFilterValues) => {
    console.log(data);
    // Convert form data to filter object
    const newFilter: Record<string, string | number | boolean> = {
      page: defaultPageNo, // Reset to first page when filtering
      limit: filter.limit || defaultPageSize,
    };

    // Add non-empty values to filter
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
        if (typeof value === "boolean" && value === true) {
          newFilter[key] = value;
        } else if (typeof value === "string" && value.trim() !== "") {
          newFilter[key] = value;
        } else if (typeof value === "number" && !isNaN(value)) {
          newFilter[key] = value;
        }
      }
    });

    setFilter(newFilter);
    setIsFilterActive(true);
  };

  const handleReset = () => {
    form.reset();
    setFilter({
      page: defaultPageNo,
      limit: filter.limit || defaultPageSize,
    });
    setIsFilterActive(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Flight Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Route */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Route
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    <Input
                      placeholder="From"
                      {...form.register("departure_airport_code")}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    <Input
                      placeholder="To"
                      {...form.register("arrival_airport_code")}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Dates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Departure"
                      {...form.register("departure_date")}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Return"
                      {...form.register("arrival_date")}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Passengers
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                  <Select
                    value={form.watch("min_available_seats")?.toString() || "1"}
                    onValueChange={(value) =>
                      form.setValue("min_available_seats", parseInt(value))
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Price Range
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[
                      form.watch("min_price") || 0,
                      form.watch("max_price") || 2000,
                    ]}
                    onValueChange={(value) => {
                      form.setValue("min_price", value[0]);
                      form.setValue("max_price", value[1]);
                    }}
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-primary">
                    <span>${form.watch("min_price") || 0}</span>
                    <span>${form.watch("max_price") || 2000}</span>
                  </div>
                </div>
              </div>

              {/* Airlines */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Airlines
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    placeholder="Enter airline name"
                    {...form.register("airline_name")}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Class Type */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Class Type
                </label>
                <Select
                  value={form.watch("class_type") || ""}
                  onValueChange={(value) => form.setValue("class_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First">First Class</SelectItem>
                    <SelectItem value="Premium Economy">
                      Premium Economy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Range */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Flight Duration (minutes)
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[
                      form.watch("min_duration") || 0,
                      form.watch("max_duration") || 600,
                    ]}
                    onValueChange={(value) => {
                      form.setValue("min_duration", value[0]);
                      form.setValue("max_duration", value[1]);
                    }}
                    max={600}
                    step={30}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-primary">
                    <span>{form.watch("min_duration") || 0}m</span>
                    <span>{form.watch("max_duration") || 600}m</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Amenities
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wifi"
                      checked={form.watch("has_wifi")}
                      onCheckedChange={(checked) =>
                        form.setValue("has_wifi", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="wifi"
                      className="text-sm text-primary flex items-center"
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      WiFi
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meal"
                      checked={form.watch("has_meal")}
                      onCheckedChange={(checked) =>
                        form.setValue("has_meal", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="meal"
                      className="text-sm text-primary flex items-center"
                    >
                      <Utensils className="w-4 h-4 mr-2" />
                      Meal Included
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="entertainment"
                      checked={form.watch("has_entertainment")}
                      onCheckedChange={(checked) =>
                        form.setValue("has_entertainment", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="entertainment"
                      className="text-sm text-primary flex items-center"
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      Entertainment
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="luggage"
                      checked={form.watch("has_luggage")}
                      onCheckedChange={(checked) =>
                        form.setValue("has_luggage", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="luggage"
                      className="text-sm text-primary flex items-center"
                    >
                      <Luggage className="w-4 h-4 mr-2" />
                      Luggage Included
                    </label>
                  </div>
                </div>
              </div>

              {/* Flight Type */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Flight Type
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="domestic"
                      checked={form.watch("is_domestic") === true}
                      onCheckedChange={(checked) =>
                        form.setValue("is_domestic", checked as boolean)
                      }
                    />
                    <label htmlFor="domestic" className="text-sm text-primary">
                      Domestic Flights Only
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-active/80 hover:bg-active/90 text-white"
                >
                  Search Flights
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleReset}
                >
                  Clear All
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FlightFilters;
