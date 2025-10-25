"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useGoogleLogin } from "@/api-config/queries/auth";
import Image from "next/image";

interface GoogleLoginButtonProps {
  size?: "sm" | "lg" | "default" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children?: React.ReactNode;
}

export function GoogleLoginButton({ 
  size = "sm", 
  variant = "outline", 
  className = "",
  children
}: GoogleLoginButtonProps) {
  const googleLoginMutation = useGoogleLogin();


  const handleGoogleLogin = () => {
    // Redirect to Google login endpoint
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/auth/google?callback=${callbackUrl}`;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoogleLogin}
      disabled={googleLoginMutation.isPending}
      className={className}
      style={{
        backgroundImage: "url('/logo/hero-bg.png')",
      }}
    >
      {children || (googleLoginMutation.isPending ? "Signing in..." : "Login")}
    </Button>
  );
}
