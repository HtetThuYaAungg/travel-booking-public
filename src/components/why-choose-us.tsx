"use client";
import React from "react";
import { Shield, Clock, Headphones, Award } from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your personal information and payments are protected with industry-leading security.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our customer support team is available around the clock to help you with any questions.",
    },
    {
      icon: Headphones,
      title: "Best Prices",
      description: "We guarantee the best prices for hotels, flights, and buses with our price match policy.",
    },
    {
      icon: Award,
      title: "Trusted Service",
      description: "Over 1 million satisfied customers trust us for their travel booking needs.",
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-active mb-4">
            Why Choose TravelBooking?
          </h2>
          <p className="text-lg text-primary">
            We make travel planning simple, secure, and affordable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-primary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

