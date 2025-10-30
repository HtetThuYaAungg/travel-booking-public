"use client";
import React, { Suspense } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { AuthNotification } from "@/components/auth-notification";

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <Suspense fallback={null}>
        <AuthNotification />
      </Suspense>
    </div>
  );
};

export default Main;
