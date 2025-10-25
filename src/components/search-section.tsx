"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel, Plane, Bus, MapPin } from "lucide-react";

export function SearchSection() {
  const searchOptions = [
    {
      icon: Hotel,
      title: "Hotels",
      description: "Find the perfect place to stay",
      href: "/hotels",
      color: "bg-active",
    },
    {
      icon: Plane,
      title: "Flights",
      description: "Book your next flight",
      href: "/flights",
      color: "bg-green-500",
    },
    {
      icon: Bus,
      title: "Buses",
      description: "Travel by bus anywhere",
      href: "/buses",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-active mb-4">
            What are you looking for?
          </h2>
          <p className="text-lg text-primary">
            Choose from our wide range of travel services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {searchOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {option.title}
                </h3>
                <p className="text-primary mb-6">
                  {option.description}
                </p>
                <Button 
                  className="w-full bg-active/80 hover:bg-active/90 text-white"
                  onClick={() => window.location.href = option.href}
                >
                  Explore {option.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

