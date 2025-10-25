"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-active text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-primary mb-4">
              TravelBooking
            </div>
            <p className="text-primary/50 mb-4">
              Your trusted partner for all travel needs. Book hotels, flights, and buses with ease.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-active">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@travelbooking.com</span>
              </div>
              <div className="flex items-center text-active">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (234) 567-890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary/50 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-primary/50 hover:text-primary transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/flights" className="text-primary/50 hover:text-primary transition-colors">
                  Flights
                </Link>
              </li>
              <li>
                <Link href="/buses" className="text-primary/50 hover:text-primary transition-colors">
                  Buses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-primary/50 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-primary/50 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary/50 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary/50 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/50 mt-8 pt-8 text-center">
          <p className="text-primary/50">
            © 2025 TravelBooking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

