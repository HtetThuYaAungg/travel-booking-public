import { useMutation, useQuery } from "@tanstack/react-query";
import { getPermission, logout, googleLogin } from "../services/auth";
import { permissionKey } from "./key";
import { removeCookieStore } from "@/helper/store";
import { useSearchParams } from "next/navigation";


export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (response) => {
      // Handle successful Google login
      if (response.data?.accessToken) {
        // Store the access token
        document.cookie = `${process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN}=${response.data.accessToken}; path=/; max-age=3600`;
        // Redirect to home or refresh the page
        window.location.href = "/";
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });
}

export const useLogout = () => {

 
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeCookieStore(
        process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string
      );
      removeCookieStore(
        process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string
    );
     
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
    },
  });
};

export function useGetPermissionByUser(id: string | number) {
  return useQuery({
    queryKey: permissionKey.userPermission,
    queryFn: () => getPermission(),
    enabled : !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
