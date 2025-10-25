import apiInstance from "../instance";


export async function googleLogin() {
  return apiInstance.get("/auth/google");
}

export async function logout() {
  console.log("logout function called");
  return apiInstance.post("/auth/logout-google");
}


export function getPermission() {
  return apiInstance.get("/user/permissions");
}