"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  IdCard,
  LogIn,
  LogOut,
  RotateCcwKey,
  Shapes,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/app/contexts/AuthContext";
import { useMessage } from "@/app/contexts/MessageContext";
import packageJson from "../../../package.json";
import { ToggleMode } from "../toggle-mode";
import { Button } from "../ui/button";
import { useState } from "react";
import { useLogout } from "@/api-config/queries/auth";
import { GoogleLoginButton } from "../google-login-button";
import { GoogleIcon } from "../svg-icons/google";
import Image from "next/image";

export function NavUser() {
  const { isAuthenticated, logout: authLogout } = useAuth();

  const { user } = useAuth();
  const message = useMessage();
  const { mutateAsync, isPending } = useLogout();

  const handleLogout = async () => {
    const loadingId = message.loading("Logging out...", 0);
    try {
      authLogout();
      await mutateAsync();
      message.remove(loadingId);
      message.success("Logged out successfully");
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
    } finally {
      message.remove(loadingId);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="items-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 rounded-lg group-first:hover:text-active">
                {isAuthenticated && user?.avatar_url ? (
                  <Image 
                    src={user.avatar_url} 
                    alt="user avatar" 
                    width={20} 
                    height={20}
                    className="rounded-lg object-cover"
                  />
                ) : (
                 <GoogleIcon />
                )}
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className=" w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={"bottom"}
          align="end"
          sideOffset={2}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-5 w-5 rounded-lg">
                {isAuthenticated && user?.avatar_url ? (
                  <Image 
                    src={user.avatar_url} 
                    alt="user avatar" 
                    width={20} 
                    height={20}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-active" />
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {isAuthenticated ? user?.name : "Guest"}
                </span>
                <span className="truncate text-xs">
                  {" "}
                  {isAuthenticated && user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <div className=" flex justify-end group gap-2">
              <ToggleMode />
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLogout()}
                >
                  <LogOut className=" text-destructive" />
                  <span className="sr-only">Log out</span>
                </Button>
              ) : (
                  <GoogleLoginButton size="default" variant="default" className="bg-transparent" >
                    {/* <div className="bg-transparent p-0"    style={{
                        backgroundImage: "url('/logo/hero-bg.png')",
                      }}> */}
                      <p className=" text-primary text-xs">Login with Google</p>
                    {/* </div> */}
                  </GoogleLoginButton>
              )}
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
