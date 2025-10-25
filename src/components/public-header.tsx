"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLogout } from "@/api-config/queries/auth";
import { GoogleLoginButton } from "@/components/google-login-button";
import { NavUser } from "./nav-user";

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout: authLogout } = useAuth();
  const logoutMutation = useLogout();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Hotels", href: "/hotels" },
    { name: "Flights", href: "/flights" },
    { name: "Buses", href: "/buses" },
    { name: "My Bookings", href: "/bookings" },
  ];

  const handleLogout = () => {
    authLogout();
    logoutMutation.mutate();
  };

  return (
    <header className="shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-active">
                TravelBooking
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-primary hover:text-active px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <NavUser />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 ">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary hover:text-active block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <GoogleLoginButton
                    size="sm"
                    variant="outline"
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
