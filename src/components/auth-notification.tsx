"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, X } from "lucide-react";

export function AuthNotification() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"success" | "error">("success");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error === "auth_failed") {
      setMessage("Authentication Failed");
      setDescription("Authentication failed. Please try again.");
      setType("error");
      setShow(true);
      
      // Remove error parameter from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`;
      router.replace(newUrl);
    } else if (success === "true") {
      setMessage("Successfully Signed In");
      setDescription("Welcome! You have been successfully signed in.");
      setType("success");
      setShow(true);
      
      // Remove success parameter from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("success");
      const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={`
          w-[420px] p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out
          ${type === "success" 
            ? "bg-green-50 border-active shadow-green-100" 
            : "bg-red-50 border-active shadow-red-100"
          }
        `}
        style={{
          boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === "success" ? (
              <CheckCircle className="h-5 w-5 text-active mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  type === "success" ? "text-active" : "text-red-800"
                }`}>
                  {message}
                </h4>
                <p className={`text-sm mt-1 ${
                  type === "success" ? "text-active" : "text-red-700"
                }`}>
                  {description}
                </p>
              </div>
              
              <button
                onClick={() => setShow(false)}
                className={`ml-4 flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                  type === "success" 
                    ? "text-active hover:bg-active/20" 
                    : "text-red-600 hover:bg-red-200"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
