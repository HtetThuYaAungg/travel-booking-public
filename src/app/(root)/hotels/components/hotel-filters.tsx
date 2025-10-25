
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MapPin, Wifi, Car, Utensils, Dumbbell } from "lucide-react";
import { useState } from "react";
import hotelFilterSchema, { HotelFilterValues } from "../schema/filter-hotel";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

interface HotelFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function HotelFilter({ filter, setFilter }: HotelFilterProps) {
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const form = useForm<HotelFilterValues>({
    resolver: zodResolver(hotelFilterSchema),
    defaultValues: {
      search: "",
      city: "",
      country: "",
      min_price: undefined,
      max_price: undefined,
      min_star_rating: undefined,
      min_rating: undefined,
      has_wifi: false,
      has_pool: false,
      has_spa: false,
      has_gym: false,
      has_restaurant: false,
      has_parking: false,
      has_pet_friendly: false,
      sort_by: "",
      sort_order: "asc",
      page: defaultPageNo,
      limit: defaultPageSize,
    },
  });

  const onSubmit = (data: HotelFilterValues) => {

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
          <CardTitle className="text-lg">Hotel Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Location */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    placeholder="Enter location"
                    {...form.register("search")}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Price Range
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[form.watch("min_price") || 0, form.watch("max_price") || 1000]}
                    onValueChange={(value) => {
                      form.setValue("min_price", value[0]);
                      form.setValue("max_price", value[1]);
                    }}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-primary">
                    <span>${form.watch("min_price") || 0}</span>
                    <span>${form.watch("max_price") || 1000}</span>
                  </div>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    placeholder="Enter city"
                    {...form.register("city")}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                  <Input
                    placeholder="Enter country"
                    {...form.register("country")}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[form.watch("min_rating") || 1]}
                    onValueChange={(value) => form.setValue("min_rating", value[0])}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-primary">
                    <span>{form.watch("min_rating") || 1}</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Minimum Star Rating
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[form.watch("min_star_rating") || 1]}
                    onValueChange={(value) => form.setValue("min_star_rating", value[0])}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-primary">
                    <span>{form.watch("min_star_rating") || 1}</span>
                    <span>5</span>
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
                      onCheckedChange={(checked) => form.setValue("has_wifi", checked as boolean)}
                    />
                    <label htmlFor="wifi" className="text-sm text-primary flex items-center">
                      <Wifi className="w-4 h-4 mr-2" />
                      Free WiFi
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={form.watch("has_parking")}
                      onCheckedChange={(checked) => form.setValue("has_parking", checked as boolean)}
                    />
                    <label htmlFor="parking" className="text-sm text-primary flex items-center">
                      <Car className="w-4 h-4 mr-2" />
                      Free Parking
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="restaurant"
                      checked={form.watch("has_restaurant")}
                      onCheckedChange={(checked) => form.setValue("has_restaurant", checked as boolean)}
                    />
                    <label htmlFor="restaurant" className="text-sm text-primary flex items-center">
                      <Utensils className="w-4 h-4 mr-2" />
                      Restaurant
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gym"
                      checked={form.watch("has_gym")}
                      onCheckedChange={(checked) => form.setValue("has_gym", checked as boolean)}
                    />
                    <label htmlFor="gym" className="text-sm text-primary flex items-center">
                      <Dumbbell className="w-4 h-4 mr-2" />
                      Fitness Center
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button type="submit" className="w-full bg-active/80 hover:bg-active/90 text-white">
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
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

export default HotelFilter;