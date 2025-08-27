import { jwtDecode } from "jwt-decode";
import type { JwtDecodedData } from "../types";

export function getJwtDecodedData(): JwtDecodedData | null {
  const authData = localStorage.getItem("auth");

  if (!authData) return null;

  try {
    const auth = JSON.parse(authData);
    const accessToken = auth.accessToken;

    if (!accessToken) return null;

    const decoded = jwtDecode<JwtDecodedData>(accessToken);
    
    return decoded ?? null;
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
}
