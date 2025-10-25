import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  fullName: string;
  avatar_url?: string; // Google profile image URL
  iat: number;
  exp: number;
  [key: string]: any;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getUserDataFromToken = (token: string | null) => {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.fullName,
    avatar_url: decoded.avatar_url,
  };
};
