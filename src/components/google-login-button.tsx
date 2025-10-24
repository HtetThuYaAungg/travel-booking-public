"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useGoogleLogin } from "@/api-config/queries/auth";

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
    >
      <User className="w-4 h-4 mr-2" />
      {children || (googleLoginMutation.isPending ? "Signing in..." : "Sign in with Google")}
    </Button>
  );
}
